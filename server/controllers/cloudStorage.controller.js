const CloudStorage = require("../models/CloudStorage")
const ErrorResponse = require("../utils/errorResponse")
const { getCloudStorageProvider } = require("../utils/cloudStorage")

// @desc    Get all cloud storage connections for a user
// @route   GET /api/cloud-storage
// @access  Private
exports.getCloudStorageConnections = async (req, res, next) => {
  try {
    const connections = await CloudStorage.find({ user: req.user.id })

    res.status(200).json({
      success: true,
      count: connections.length,
      data: {
        connections,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single cloud storage connection
// @route   GET /api/cloud-storage/:id
// @access  Private
exports.getCloudStorageConnection = async (req, res, next) => {
  try {
    const connection = await CloudStorage.findById(req.params.id)

    if (!connection) {
      return next(new ErrorResponse(`Cloud storage connection not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the connection
    if (connection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to access this connection`, 403))
    }

    res.status(200).json({
      success: true,
      data: {
        connection,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create new cloud storage connection
// @route   POST /api/cloud-storage
// @access  Private

// exports.createCloudStorageConnection = async (req, res, next) => {
//   try {
//     // Add user to req.body
//     req.body.user = req.user.id

//     // Validate provider
//     if (!["aws", "gcp", "azure", "dropbox"].includes(req.body.provider)) {
//       return next(new ErrorResponse("Invalid provider", 400))
//     }

//     // Validate credentials based on provider
//     switch (req.body.provider) {
//       case "aws":
//         if (
//           !req.body.credentials ||
//           !req.body.credentials.accessKeyId ||
//           !req.body.credentials.secretAccessKey ||
//           !req.body.credentials.region ||
//           !req.body.credentials.bucket
//         ) {
//           return next(new ErrorResponse("Please provide all required AWS credentials", 400))
//         }
//         break
//       case "gcp":
//         if (
//           !req.body.credentials ||
//           !req.body.credentials.projectId ||
//           !req.body.credentials.keyFile ||
//           !req.body.credentials.bucket
//         ) {
//           return next(new ErrorResponse("Please provide all required Google Cloud credentials", 400))
//         }
//         break
//       case "azure":
//         if (
//           !req.body.credentials ||
//           !req.body.credentials.accountName ||
//           !req.body.credentials.accountKey ||
//           !req.body.credentials.containerName
//         ) {
//           return next(new ErrorResponse("Please provide all required Azure credentials", 400))
//         }
//         break
//       case "dropbox":
//         if (!req.body.credentials || !req.body.credentials.accessToken) {
//           return next(new ErrorResponse("Please provide Dropbox access token", 400))
//         }
//         break
//     }

//     // Attempt to connect to the cloud provider and verify credentials
//     try {
//       const provider = await getCloudStorageProvider(req.body.provider, null, req.body.credentials)


//       // Get storage stats
//       const stats = await provider.getStorageStats()

//       // Create connection record
//       const connection = await CloudStorage.create({
//         ...req.body,
//         storageStats: {
//           total: stats.total,
//           used: stats.used,
//           lastUpdated: new Date(),
//         },
//       })

//       res.status(201).json({
//         success: true,
//         data: {
//           connection,
//         },
//       })
//     } catch (error) {
//       return next(new ErrorResponse(`Failed to connect to cloud provider: ${error.message}`, 400))
//     }
//   } catch (err) {
//     next(err)
//   }
// }


exports.createCloudStorageConnection = async (req, res, next) => {
  try {
    req.body.user = req.user.id;


    console.log(req.body.provider)
    // Validate provider
    if (!["aws", "gcp", "azure", "dropbox", "cloudinary"].includes(req.body.provider)) {
      return next(new ErrorResponse("Invalid provider", 400));
    }

    // Validate credentials based on provider
    switch (req.body.provider) {
      case "aws":
        // AWS validation logic...
        break;
      case "gcp":
        // GCP validation logic...
        break;
      case "azure":
        // Azure validation logic...
        break;
      case "dropbox":
        // Dropbox validation logic...
        break;
      case "cloudinary":
        if (
          !req.body.credentials ||
          !req.body.credentials.cloudName ||
          !req.body.credentials.apiKey ||
          !req.body.credentials.apiSecret
        ) {
          return next(new ErrorResponse("Please provide all required Cloudinary credentials", 400));
        }
        break;
    }

    // Attempt to connect to the cloud provider and verify credentials
    try {
      const provider = await getCloudStorageProvider(req.body.provider, null, req.body.credentials);

      // Get storage stats (implement Cloudinary stats retrieval)
      const stats = await provider.getStorageStats();

      console.log(req.body.credentials)
      // Create connection record
      const connection = await CloudStorage.create({
        ...req.body,
        credentials: {
          ...req.body.credentials,
        },
        storageStats: {
          total: stats.total,
          used: stats.used,
          free: stats.free,
          lastUpdated: new Date(),
        },
      });

      res.status(201).json({
        success: true,
        data: {
          connection,
        },
      });
    } catch (error) {
      return next(new ErrorResponse(`Failed to connect to cloud provider: ${error.message}`, 400));
    }
  } catch (err) {
    next(err);
  }
};


// @desc    Update cloud storage connection
// @route   PUT /api/cloud-storage/:id
// @access  Private
exports.updateCloudStorageConnection = async (req, res, next) => {
  try {
    let connection = await CloudStorage.findById(req.params.id)

    if (!connection) {
      return next(new ErrorResponse(`Cloud storage connection not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the connection
    if (connection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to update this connection`, 403))
    }

    // Don't allow changing the provider
    if (req.body.provider && req.body.provider !== connection.provider) {
      return next(new ErrorResponse(`Cannot change provider of an existing connection`, 400))
    }

    // If credentials are updated, verify them
    if (req.body.credentials) {
      try {
        // Merge existing credentials with updates
        const updatedCredentials = {
          ...connection.credentials,
          ...req.body.credentials,
        }

        const provider = await getCloudStorageProvider(connection.provider, null, updatedCredentials)

        // Get updated storage stats
        const stats = await provider.getStorageStats()

        req.body.storageStats = {
          total: stats.total,
          used: stats.used,
          lastUpdated: new Date(),
        }

        req.body.status = "connected"
        req.body.error = ""
        req.body.lastSync = new Date()
      } catch (error) {
        req.body.status = "error"
        req.body.error = error.message
      }
    }

    // Update connection
    connection = await CloudStorage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: {
        connection,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete cloud storage connection
// @route   DELETE /api/cloud-storage/:id
// @access  Private
exports.deleteCloudStorageConnection = async (req, res, next) => {
  try {


    const connection = await CloudStorage.findById(req.params.id)
    console.log(connection)

    if (!connection) {
      return next(new ErrorResponse(`Cloud storage connection not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the connection
    if (connection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to delete this connection`, 403))
    }

    await CloudStorage.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Sync cloud storage connection (update stats and status)
// @route   PUT /api/cloud-storage/:id/sync
// @access  Private
exports.syncCloudStorageConnection = async (req, res, next) => {
  try {
    const connection = await CloudStorage.findById(req.params.id)

    if (!connection) {
      return next(new ErrorResponse(`Cloud storage connection not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the connection
    if (connection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to sync this connection`, 403))
    }

    try {
      const provider = await getCloudStorageProvider(connection.provider, req.user.id)

      // Get updated storage stats
      const stats = await provider.getStorageStats()

      // Update connection
      connection.storageStats = {
        total: stats.total,
        used: stats.used,
        free: stats.free,
        lastUpdated: new Date(),
      }

      connection.status = "connected"
      connection.error = ""
      connection.lastSync = new Date()

      await connection.save()

      res.status(200).json({
        success: true,
        data: {
          connection,
        },
      })
    } catch (error) {
      connection.status = "error"
      connection.error = error.message
      await connection.save()

      return next(new ErrorResponse(`Failed to sync cloud storage: ${error.message}`, 400))
    }
  } catch (err) {
    next(err)
  }
}

// @desc    List files in cloud storage
// @route   GET /api/cloud-storage/:id/files
// @access  Private
exports.listCloudStorageFiles = async (req, res, next) => {
  try {
    const connection = await CloudStorage.findById(req.params.id)

    if (!connection) {
      return next(new ErrorResponse(`Cloud storage connection not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the connection
    if (connection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to access this connection`, 403))
    }

    try {
      const provider = await getCloudStorageProvider(connection.provider, req.user.id)

      // Get prefix from query params or use empty string
      const prefix = req.query.prefix || ""

      // List files
      const files = await provider.listFiles(connection.credentials.bucket, prefix)

      res.status(200).json({
        success: true,
        count: files.length,
        data: {
          files,
        },
      })
    } catch (error) {
      return next(new ErrorResponse(`Failed to list files: ${error.message}`, 400))
    }
  } catch (err) {
    next(err)
  }
}
