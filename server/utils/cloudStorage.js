const AWS = require("aws-sdk")
const { Storage } = require("@google-cloud/storage")
const { BlobServiceClient } = require("@azure/storage-blob")
const { Dropbox } = require("dropbox")
const fetch = require("node-fetch")
const CloudStorage = require("../models/CloudStorage")
const fs = require("fs")
const path = require("path")
const config = require("../config/config")
const Cloudinary = require("cloudinary").v2; // Import Cloudinary

// Get cloud storage provider based on provider name and user ID
exports.getCloudStorageProvider = async (providerName, userId, credentials = null) => {
    // If credentials are provided, use them
    if (credentials) {
        return createProviderFromCredentials(providerName, credentials)
    }

    // Otherwise, look up credentials for the user
    if (!userId) {
        throw new Error("User ID is required when credentials are not provided")
    }

    const connection = await CloudStorage.findOne({
        user: userId,
        provider: providerName,
        status: "connected",
    })

    if (!connection) {
        throw new Error(`No connected ${providerName} storage found for this user`)
    }

    return createProviderFromCredentials(providerName, connection.credentials)
}

// Upload file to cloud storage
exports.uploadToCloud = async (providerName, credentials, bucket, key, filePath, contentType) => {
    const provider = await createProviderFromCredentials(providerName, credentials)
    return provider.uploadFile(bucket, key, filePath, contentType)
}

// Remove file from cloud storage
exports.removeFromCloud = async (cloudStorage) => {
    const { provider, bucket, key } = cloudStorage
    const providerInstance = await exports.getCloudStorageProvider(provider, null, cloudStorage)
    return providerInstance.deleteFile(bucket, key)
}

// Create provider instance from credentials
// const createProviderFromCredentials = (providerName, credentials) => {
//     switch (providerName) {
//         case "aws":
//             return new AWSProvider(credentials)
//         case "gcp":
//             return new GCPProvider(credentials)
//         case "azure":
//             return new AzureProvider(credentials)
//         case "dropbox":
//             return new DropboxProvider(credentials)
//         default:
//             throw new Error(`Unsupported cloud provider: ${providerName}`)
//     }
// }

const createProviderFromCredentials = (providerName, credentials) => {
    switch (providerName) {
        case "aws":
            return new AWSProvider(credentials);
        case "gcp":
            return new GCPProvider(credentials);
        case "azure":
            return new AzureProvider(credentials);
        case "dropbox":
            return new DropboxProvider(credentials);
        case "cloudinary":
            return new CloudinaryProvider(credentials); // Add Cloudinary provider
        default:
            throw new Error(`Unsupported cloud provider: ${providerName}`);
    }
};

// AWS S3 Provider
class AWSProvider {
    constructor(credentials) {
        this.s3 = new AWS.S3({
            accessKeyId: credentials.accessKeyId || config.aws.accessKeyId,
            secretAccessKey: credentials.secretAccessKey || config.aws.secretAccessKey,
            region: credentials.region || config.aws.region,
        })
        this.bucket = credentials.bucket || config.aws.bucket
    }

    async getStorageStats() {
        try {
            // AWS S3 doesn't provide bucket size directly
            // We'll approximate by listing objects and summing their sizes
            let continuationToken = null
            let totalSize = 0
            let isTruncated = true

            while (isTruncated) {
                const params = {
                    Bucket: this.bucket,
                    MaxKeys: 1000,
                }

                if (continuationToken) {
                    params.ContinuationToken = continuationToken
                }

                const response = await this.s3.listObjectsV2(params).promise()

                response.Contents.forEach((item) => {
                    totalSize += item.Size
                })

                isTruncated = response.IsTruncated
                if (isTruncated) {
                    continuationToken = response.NextContinuationToken
                }
            }

            return {
                total: Number.POSITIVE_INFINITY, // S3 doesn't have a storage limit
                used: totalSize,
            }
        } catch (error) {
            throw new Error(`Failed to get storage stats: ${error.message}`)
        }
    }

    async listFiles(bucket, prefix) {
        try {
            const params = {
                Bucket: bucket || this.bucket,
                Prefix: prefix,
                MaxKeys: 1000,
            }

            const response = await this.s3.listObjectsV2(params).promise()

            return response.Contents.map((item) => ({
                key: item.Key,
                size: item.Size,
                lastModified: item.LastModified,
            }))
        } catch (error) {
            throw new Error(`Failed to list files: ${error.message}`)
        }
    }

    async getObjectMetadata(bucket, key) {
        try {
            const params = {
                Bucket: bucket || this.bucket,
                Key: key,
            }

            const response = await this.s3.headObject(params).promise()

            return {
                contentType: response.ContentType,
                size: response.ContentLength,
                lastModified: response.LastModified,
            }
        } catch (error) {
            throw new Error(`Failed to get object metadata: ${error.message}`)
        }
    }

    async uploadFile(bucket, key, filePath, contentType) {
        try {
            const fileContent = fs.readFileSync(filePath)

            const params = {
                Bucket: bucket || this.bucket,
                Key: key,
                Body: fileContent,
                ContentType: contentType,
            }

            const response = await this.s3.upload(params).promise()

            return {
                url: response.Location,
                provider: "aws",
                bucket: bucket || this.bucket,
                key,
            }
        } catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`)
        }
    }

    async deleteFile(bucket, key) {
        try {
            const params = {
                Bucket: bucket || this.bucket,
                Key: key,
            }

            await this.s3.deleteObject(params).promise()

            return true
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`)
        }
    }

    async getSignedUrl(bucket, key, expiresInSeconds = 3600) {
        try {
            const params = {
                Bucket: bucket || this.bucket,
                Key: key,
                Expires: expiresInSeconds,
            }

            const url = await this.s3.getSignedUrlPromise("getObject", params)

            return url
        } catch (error) {
            throw new Error(`Failed to generate signed URL: ${error.message}`)
        }
    }
}

// Google Cloud Storage Provider
class GCPProvider {
    constructor(credentials) {
        let keyFile;

        if (credentials.keyFile) {
            // If key file is provided as a string (JSON), parse it
            try {
                keyFile = JSON.parse(credentials.keyFile);
            } catch (error) {
                throw new Error('Invalid GCP key file format');
            }
        }

        this.storage = new Storage({
            projectId: credentials.projectId || config.google.projectId,
            keyFilename: credentials.keyFilename || config.google.keyFilename,
            credentials: keyFile,
        });

        this.bucket = credentials.bucket || config.google.bucket;
    }

    async getStorageStats() {
        try {
            const [files] = await this.storage.bucket(this.bucket).getFiles();

            let totalSize = 0;
            files.forEach(file => {
                totalSize += Number.parseInt(file.metadata.size, 10) || 0;
            });

            return {
                total: Number.POSITIVE_INFINITY, // GCS doesn't have a storage limit
                used: totalSize,
            };
        } catch (error) {
            throw new Error(`Failed to get storage stats: ${error.message}`);
        }
    }

    async listFiles(bucket, prefix) {
        try {
            const options = {};
            if (prefix) {
                options.prefix = prefix;
            }

            const [files] = await this.storage.bucket(bucket || this.bucket).getFiles(options);

            return files.map(file => ({
                key: file.name,
                size: Number.parseInt(file.metadata.size, 10) || 0,
                lastModified: file.metadata.updated,
            }));
        } catch (error) {
            throw new Error(`Failed to list files: ${error.message}`);
        }
    }

    async getObjectMetadata(bucket, key) {
        try {
            const [metadata] = await this.storage
                .bucket(bucket || this.bucket)
                .file(key)
                .getMetadata();

            return {
                contentType: metadata.contentType,
                size: Number.parseInt(metadata.size, 10) || 0,
                lastModified: metadata.updated,
            };
        } catch (error) {
            throw new Error(`Failed to get object metadata: ${error.message}`);
        }
    }

    async uploadFile(bucket, key, filePath, contentType) {
        try {
            const options = {
                metadata: {
                    contentType,
                },
            };

            await this.storage
                .bucket(bucket || this.bucket)
                .upload(filePath, options);

            const file = this.storage.bucket(bucket || this.bucket).file(key);


            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 24 * 60 * 60 * 1000,
            });
        }
        catch {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

}


// Azure Provider
class AzureProvider {
    constructor(credentials) {
        this.blobServiceClient = BlobServiceClient.fromConnectionString(
            credentials.connectionString || config.azure.connectionString
        );
        this.containerName = credentials.containerName || config.azure.containerName;
    }

    async getStorageStats() {
        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            let totalSize = 0;

            // Iterate blobs in container to calculate total size
            for await (const blob of containerClient.listBlobsFlat()) {
                totalSize += blob.properties.contentLength || 0;
            }

            // Azure Blob storage does not have a fixed storage limit
            return {
                total: Number.POSITIVE_INFINITY,
                used: totalSize,
            };
        } catch (error) {
            throw new Error(`Failed to get storage stats: ${error.message}`);
        }
    }

    async listFiles(containerName, prefix) {
        try {
            const client = this.blobServiceClient.getContainerClient(containerName || this.containerName);
            const files = [];
            for await (const blob of client.listBlobsFlat({ prefix })) {
                files.push({
                    key: blob.name,
                    size: blob.properties.contentLength || 0,
                    lastModified: blob.properties.lastModified,
                });
            }
            return files;
        } catch (error) {
            throw new Error(`Failed to list files: ${error.message}`);
        }
    }

    async getObjectMetadata(containerName, key) {
        try {
            const client = this.blobServiceClient.getContainerClient(containerName || this.containerName);
            const blobClient = client.getBlobClient(key);
            const properties = await blobClient.getProperties();

            return {
                contentType: properties.contentType,
                size: properties.contentLength,
                lastModified: properties.lastModified,
            };
        } catch (error) {
            throw new Error(`Failed to get object metadata: ${error.message}`);
        }
    }

    async uploadFile(containerName, key, filePath, contentType) {
        try {
            const client = this.blobServiceClient.getContainerClient(containerName || this.containerName);
            const blockBlobClient = client.getBlockBlobClient(key);
            const uploadOptions = {
                blobHTTPHeaders: { blobContentType: contentType },
            };
            const fileStream = fs.createReadStream(filePath);
            await blockBlobClient.uploadStream(fileStream, undefined, undefined, uploadOptions);

            return {
                url: blockBlobClient.url,
                provider: "azure",
                bucket: containerName || this.containerName,
                key,
            };
        } catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    async deleteFile(containerName, key) {
        try {
            const client = this.blobServiceClient.getContainerClient(containerName || this.containerName);
            const blobClient = client.getBlobClient(key);
            await blobClient.deleteIfExists();
            return true;
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
}

// Dropbox Provider
class DropboxProvider {
    constructor(credentials) {
        this.dbx = new Dropbox({ accessToken: credentials.accessToken });
    }

    async getStorageStats() {
        try {
            const usage = await this.dbx.usersGetSpaceUsage();
            return {
                total: usage.allocation.allocated || Number.POSITIVE_INFINITY,
                used: usage.used,
            };
        } catch (error) {
            throw new Error(`Failed to get storage stats: ${error.message}`);
        }
    }

    // Note: Dropbox API does not have "buckets", keys are paths in the user's Dropbox

    async listFiles(folderPath = "") {
        try {
            const response = await this.dbx.filesListFolder({ path: folderPath });
            return response.entries.map(item => ({
                key: item.path_lower,
                size: item.size || 0,
                lastModified: item.server_modified || item.client_modified,
            }));
        } catch (error) {
            throw new Error(`Failed to list files: ${error.message}`);
        }
    }

    async getObjectMetadata(path) {
        try {
            const response = await this.dbx.filesGetMetadata({ path });
            return {
                contentType: response[".tag"] === "file" ? response.media_info?.metadata?.mime_type || "application/octet-stream" : null,
                size: response.size || 0,
                lastModified: response.server_modified || response.client_modified,
            };
        } catch (error) {
            throw new Error(`Failed to get object metadata: ${error.message}`);
        }
    }

    async uploadFile(folderPath, key, filePath, contentType) {
        try {
            const contents = fs.readFileSync(filePath);
            const dropboxPath = path.posix.join(folderPath, key);
            const response = await this.dbx.filesUpload({
                path: dropboxPath,
                contents,
                mode: { ".tag": "overwrite" },
                mute: true,
                strict_conflict: false,
            });
            return {
                url: null, // Dropbox files URLs require separate sharing links
                provider: "dropbox",
                bucket: folderPath,
                key,
            };
        } catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    async deleteFile(folderPath, key) {
        try {
            const dropboxPath = path.posix.join(folderPath, key);
            await this.dbx.filesDeleteV2({ path: dropboxPath });
            return true;
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
}


// Cloudinary Provider
class CloudinaryProvider {
    constructor(credentials) {
        Cloudinary.config({
            cloud_name: credentials.cloudName || config.cloudinary.cloudName,
            api_key: credentials.apiKey || config.cloudinary.apiKey,
            api_secret: credentials.apiSecret || config.cloudinary.apiSecret,
        });
    }

    // async getStorageStats() {
    //     // Cloudinary does not provide direct storage stats, you may need to implement your own logic
    //     // For example, you can use the Admin API to get usage stats
    //     const result = await Cloudinary.api.usage();
    //     console.log(result)
    //     return {
    //         total: result.total_bytes, // Total storage in bytes
    //         used: result.used_bytes, // Used storage in bytes
    //     };
    // }

    async getStorageStats() {
        // Fetch usage stats from Cloudinary
        const result = await Cloudinary.api.usage()
        const freePlanMaxStorageGB = 25;
        // if (result && result.storage && result.storage.usage) {
        const usedStorageBytes = result.storage.usage;
        // Maximum storage for the free plan (in GB)
        const freePlanMaxStorageBytes = freePlanMaxStorageGB * 1024 * 1024 * 1024;

        const freeStorageBytes = freePlanMaxStorageBytes - usedStorageBytes;

        const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);
        const bytesToGB = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

        console.log('Cloudinary Storage Usage (Free Plan):');
        console.log('Used Storage:', bytesToMB(usedStorageBytes), 'MB', `(${bytesToGB(usedStorageBytes)} GB)`);
        console.log('Maximum Storage (Free Plan):', freePlanMaxStorageGB, 'GB');
        console.log('Free Storage:', bytesToMB(freeStorageBytes), 'MB', `(${bytesToGB(freeStorageBytes)} GB)`);

        return {
            total: freePlanMaxStorageBytes, // Total storage in bytes
            used: usedStorageBytes, // Used storage in bytes
            free: freeStorageBytes
        };
    }

    async uploadFile(bucket, key, filePath, contentType) {
        try {
            const result = await Cloudinary.uploader.upload(filePath, {
                public_id: key,
                resource_type: "auto", // Automatically determine the resource type
            });

            return {
                url: result.secure_url,
                provider: "cloudinary",
                bucket: bucket, // Cloudinary does not use buckets in the same way
                key,
            };
        } catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    async deleteFile(bucket, key) {
        try {
            await Cloudinary.uploader.destroy(key, { resource_type: "auto" });
            return true;
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    async getObjectMetadata(bucket, key) {
        // Cloudinary does not provide direct metadata retrieval by key
        // You may need to implement your own logic to fetch metadata if needed, possibly by using the Admin API to get details about the uploaded resource. 

        try {
            const result = await Cloudinary.api.resource(key, { resource_type: "auto" });
            return {
                contentType: result.resource_type,
                size: result.bytes,
                lastModified: result.updated_at,
            };
        } catch (error) {
            throw new Error(`Failed to get object metadata: ${error.message}`);
        }
    }
}