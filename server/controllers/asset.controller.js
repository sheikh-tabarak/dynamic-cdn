const Asset = require("../models/Asset")
const VirtualUrl = require("../models/VirtualUrl")
const User = require("../models/User")
const Collection = require("../models/Collection")
const ErrorResponse = require("../utils/errorResponse")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util")
const multer = require("multer")
const axios = require("axios")
const mime = require("mime-types")
const { uploadToCloud, getCloudStorageProvider } = require("../utils/cloudStorage")
const unlink = promisify(fs.unlink)

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../public/assets")

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  // Allow all file types for now
  cb(null, true)
}

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
})

// @desc    Upload asset for a virtual URL
// @route   POST /api/assets/upload/:virtualUrlId
// @access  Private
exports.uploadAsset = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse(`Please upload a file`, 400))
    }

    const virtualUrl = await VirtualUrl.findById(req.params.virtualUrlId)

    if (!virtualUrl) {
      // Delete the uploaded file
      await unlink(req.file.path)
      return next(new ErrorResponse(`Virtual URL not found with id of ${req.params.virtualUrlId}`, 404))
    }

    // Make sure user owns the virtual URL
    if (virtualUrl.user.toString() !== req.user.id && req.user.role !== "admin") {
      // Delete the uploaded file
      await unlink(req.file.path)
      return next(new ErrorResponse(`User not authorized to upload assets to this virtual URL`, 403))
    }

    // Check storage quota
    const user = await User.findById(req.user.id)
    if (user.storageUsed + req.file.size > user.storageQuota) {
      // Delete the uploaded file
      await unlink(req.file.path)
      return next(new ErrorResponse(`Storage quota exceeded. Please upgrade your plan or free up space.`, 403))
    }

    // Determine content type and metadata
    const contentType = req.file.mimetype
    const size = req.file.size
    const metadata = {}

    // Create asset
    const asset = await Asset.create({
      name: req.file.originalname,
      virtualUrl: virtualUrl._id,
      user: req.user.id,
      type: "uploaded",
      contentType,
      size,
      path: `/public/assets/${req.file.filename}`,
      metadata,
      isActive: req.body.isActive === "true",
    })

    // Update user's storage used
    user.storageUsed += size
    await user.save()

    // If marked as active, update virtual URL's activeAsset
    if (req.body.isActive === "true") {
      virtualUrl.activeAsset = asset._id
      await virtualUrl.save()
    }

    res.status(201).json({
      success: true,
      data: {
        asset,
      },
    })
  } catch (err) {
    // Delete the uploaded file if there was an error
    if (req.file) {
      await unlink(req.file.path)
    }
    next(err)
  }
}

// @desc    Add external URL asset
// @route   POST /api/assets/external/:virtualUrlId
// @access  Private
exports.addExternalAsset = async (req, res, next) => {
  try {
    const { externalUrl, name, isActive } = req.body

    if (!externalUrl) {
      return next(new ErrorResponse(`Please provide an external URL`, 400))
    }

    const virtualUrl = await VirtualUrl.findById(req.params.virtualUrlId)

    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found with id of ${req.params.virtualUrlId}`, 404))
    }

    // Make sure user owns the virtual URL
    if (virtualUrl.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to add assets to this virtual URL`, 403))
    }

    // Validate external URL
    try {
      const response = await axios.head(externalUrl)
      const contentType = response.headers["content-type"]
      const contentLength = response.headers["content-length"] || 0

      // Create asset
      const asset = await Asset.create({
        name: name || new URL(externalUrl).pathname.split("/").pop(),
        virtualUrl: virtualUrl._id,
        user: req.user.id,
        type: "external",
        contentType,
        size: Number.parseInt(contentLength, 10),
        externalUrl,
        isActive: isActive === "true",
      })

      // If marked as active, update virtual URL's activeAsset
      if (isActive === "true") {
        virtualUrl.activeAsset = asset._id
        await virtualUrl.save()
      }

      res.status(201).json({
        success: true,
        data: {
          asset,
        },
      })
    } catch (error) {
      return next(new ErrorResponse(`Invalid or inaccessible external URL`, 400))
    }
  } catch (err) {
    next(err)
  }
}

// @desc    Add cloud storage asset
// @route   POST /api/assets/cloud/:virtualUrlId
// @access  Private
exports.addCloudAsset = async (req, res, next) => {
  try {
    const { provider, bucket, key, name, isActive } = req.body

    if (!provider || !bucket || !key) {
      return next(new ErrorResponse(`Please provide provider, bucket and key`, 400))
    }

    const virtualUrl = await VirtualUrl.findById(req.params.virtualUrlId)

    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found with id of ${req.params.virtualUrlId}`, 404))
    }

    // Make sure user owns the virtual URL
    if (virtualUrl.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to add assets to this virtual URL`, 403))
    }

    // Get the cloud storage provider
    const cloudProvider = await getCloudStorageProvider(provider, req.user.id)
    if (!cloudProvider) {
      return next(new ErrorResponse(`Cloud storage provider not found or not connected`, 404))
    }

    // Verify the object exists and get its metadata
    try {
      const metadata = await cloudProvider.getObjectMetadata(bucket, key)

      // Create asset
      const asset = await Asset.create({
        name: name || key.split("/").pop(),
        virtualUrl: virtualUrl._id,
        user: req.user.id,
        type: "cloud",
        contentType: metadata.contentType || mime.lookup(key) || "application/octet-stream",
        size: metadata.size || 0,
        cloudStorage: {
          provider,
          bucket,
          key,
          url: metadata.url,
        },
        isActive: isActive === "true",
      })

      // If marked as active, update virtual URL's activeAsset
      if (isActive === "true") {
        virtualUrl.activeAsset = asset._id
        await virtualUrl.save()
      }

      res.status(201).json({
        success: true,
        data: {
          asset,
        },
      })
    } catch (error) {
      return next(new ErrorResponse(`Object not found in cloud storage or access denied`, 400))
    }
  } catch (err) {
    next(err)
  }
}

// @desc    Get all assets for a user
// @route   GET /api/assets
// @access  Private
exports.getAssets = async (req, res, next) => {
  try {
    // Add query params for filtering
    const query = { user: req.user.id }

    if (req.query.virtualUrl) {
      query.virtualUrl = req.query.virtualUrl
    }

    if (req.query.type) {
      query.type = req.query.type
    }

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" }
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Asset.countDocuments(query)

    const assets = await Asset.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("virtualUrl", "path fullPath")

    // Pagination result
    const pagination = {}

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      }
    }

    res.status(200).json({
      success: true,
      count: assets.length,
      pagination,
      total,
      data: {
        assets,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Private
exports.getAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("virtualUrl", "path fullPath collection")
      .populate({
        path: "virtualUrl",
        populate: {
          path: "collection",
          select: "name",
        },
      })

    if (!asset) {
      return next(new ErrorResponse(`Asset not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the asset
    if (asset.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to access this asset`, 403))
    }

    res.status(200).json({
      success: true,
      data: {
        asset,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private
exports.updateAsset = async (req, res, next) => {
  try {
    let asset = await Asset.findById(req.params.id)

    if (!asset) {
      return next(new ErrorResponse(`Asset not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the asset
    if (asset.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to update this asset`, 403))
    }

    // Update asset
    asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    // If marked as active, update virtual URL's activeAsset
    if (req.body.isActive === true) {
      const virtualUrl = await VirtualUrl.findById(asset.virtualUrl)
      if (virtualUrl) {
        virtualUrl.activeAsset = asset._id
        await virtualUrl.save()
      }
    }

    res.status(200).json({
      success: true,
      data: {
        asset,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private
exports.deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id)

    if (!asset) {
      return next(new ErrorResponse(`Asset not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the asset
    if (asset.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to delete this asset`, 403))
    }

    // Check if this is the only asset for the virtual URL
    const assetCount = await Asset.countDocuments({ virtualUrl: asset.virtualUrl })
    if (assetCount <= 1) {
      return next(
        new ErrorResponse(`Cannot delete the only asset for a virtual URL. Delete the virtual URL instead.`, 400),
      )
    }

    // Check if this is the active asset
    const virtualUrl = await VirtualUrl.findById(asset.virtualUrl)
    const isActive = virtualUrl && virtualUrl.activeAsset && virtualUrl.activeAsset.toString() === asset._id.toString()

    if (isActive) {
      return next(new ErrorResponse(`Cannot delete the active asset. Set another asset as active first.`, 400))
    }

    // Delete the actual file if it's an uploaded asset
    if (asset.type === "uploaded" && asset.path) {
      try {
        const filePath = path.join(__dirname, "..", asset.path)
        if (fs.existsSync(filePath)) {
          await unlink(filePath)
        }
      } catch (err) {
        console.error(`Error deleting file: ${asset.path}`, err)
      }
    }

    // Update user's storage used
    const user = await User.findById(req.user.id)
    if (user) {
      user.storageUsed = Math.max(0, user.storageUsed - asset.size)
      await user.save()
    }

    // Delete the asset document
    await asset.remove()

    // Update virtual URL and collection storage
    if (virtualUrl) {
      await virtualUrl.updateStorageUsed()
    }

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Set asset as active
// @route   PUT /api/assets/:id/set-active
// @access  Private
exports.setActiveAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id)

    if (!asset) {
      return next(new ErrorResponse(`Asset not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the asset
    if (asset.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to update this asset`, 403))
    }

    // Update virtual URL's activeAsset
    const virtualUrl = await VirtualUrl.findById(asset.virtualUrl)
    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found`, 404))
    }

    // Mark all assets of this virtual URL as inactive
    await Asset.updateMany({ virtualUrl: virtualUrl._id }, { isActive: false })

    // Mark this asset as active
    asset.isActive = true
    await asset.save()

    // Update virtual URL
    virtualUrl.activeAsset = asset._id
    await virtualUrl.save()

    res.status(200).json({
      success: true,
      data: {
        asset,
      },
    })
  } catch (err) {
    next(err)
  }
}
