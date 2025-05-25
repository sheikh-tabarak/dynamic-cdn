const VirtualUrl = require("../models/VirtualUrl")
const Collection = require("../models/Collection")
const Asset = require("../models/Asset")
const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util")
const unlink = promisify(fs.unlink)
const { uploadToCloud, removeFromCloud } = require("../utils/cloudStorage")

// @desc    Get all virtual URLs for the logged-in user
// @route   GET /api/virtual-urls
// @access  Private
exports.getVirtualUrls = async (req, res, next) => {
  try {
    // Add query params for filtering
    const query = { user: req.user.id }

    if (req.query.collection) {
      query.collection = req.query.collection
    }

    if (req.query.search) {
      query.$or = [
        { path: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ]
    }

    if (req.query.status) {
      query.status = req.query.status
    }

    if (req.query.contentType) {
      query.contentType = req.query.contentType
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await VirtualUrl.countDocuments(query)

    const virtualUrls = await VirtualUrl.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("collection", "name pathPrefix")
      .populate("activeAsset", "name contentType size path type")

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
      // count: virtualUrls.length,
      pagination,
      total,
      data: {
        virtualUrls,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single virtual URL
// @route   GET /api/virtual-urls/:id
// @access  Private
exports.getVirtualUrl = async (req, res, next) => {
  try {
    const virtualUrl = await VirtualUrl.findById(req.params.id)
      .populate("collection", "name pathPrefix")
      .populate("activeAsset", "name contentType size path type createdAt")

    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the virtual URL
    if (virtualUrl.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to access this virtual URL`, 403))
    }

    res.status(200).json({
      success: true,
      data: {
        virtualUrl,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create new virtual URL
// @route   POST /api/virtual-urls
// @access  Private
exports.createVirtualUrl = async (req, res, next) => {
  try {
    // Check if collection exists and user owns it
    const collection = await Collection.findById(req.body.collection)

    if (!collection) {
      return next(new ErrorResponse(`Collection not found with id of ${req.body.collection}`, 404))
    }

    if (collection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to add virtual URLs to this collection`, 403))
    }

    // Check if user has reached virtual URLs quota
    const virtualUrlsCount = await VirtualUrl.countDocuments({ user: req.user.id })
    const user = await User.findById(req.user.id)

    if (virtualUrlsCount >= user.virtualUrlQuota) {
      return next(new ErrorResponse(`Virtual URLs quota exceeded. Please upgrade your plan.`, 403))
    }

    // Check if path is unique within collection
    const pathExists = await VirtualUrl.findOne({
      collection: collection._id,
      path: req.body.path,
    })

    if (pathExists) {
      return next(new ErrorResponse(`Path '${req.body.path}' already exists in this collection`, 400))
    }

    // Add user to request body
    req.body.user = req.user.id

    // Create virtual URL
    const virtualUrl = await VirtualUrl.create(req.body)

    // Add to collection's virtualUrls array
    collection.virtualUrls.push(virtualUrl._id)
    await collection.save()

    res.status(201).json({
      success: true,
      data: {
        virtualUrl,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update virtual URL
// @route   PUT /api/virtual-urls/:id
// @access  Private
exports.updateVirtualUrl = async (req, res, next) => {
  try {
    let virtualUrl = await VirtualUrl.findById(req.params.id)

    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the virtual URL
    if (virtualUrl.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to update this virtual URL`, 403))
    }

    // Check if trying to change path and if it's unique within collection
    if (req.body.path && req.body.path !== virtualUrl.path) {
      const pathExists = await VirtualUrl.findOne({
        collection: virtualUrl.collection,
        path: req.body.path,
        _id: { $ne: virtualUrl._id }, // Exclude current virtual URL
      })

      if (pathExists) {
        return next(new ErrorResponse(`Path '${req.body.path}' already exists in this collection`, 400))
      }
    }

    // Update virtual URL
    virtualUrl = await VirtualUrl.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: {
        virtualUrl,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete virtual URL
// @route   DELETE /api/virtual-urls/:id
// @access  Private
exports.deleteVirtualUrl = async (req, res, next) => {
  try {
    const virtualUrl = await VirtualUrl.findById(req.params.id)

    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the virtual URL
    if (virtualUrl.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to delete this virtual URL`, 403))
    }

    // Get all assets associated with this virtual URL
    const assets = await Asset.find({ virtualUrl: virtualUrl._id })

    // Delete all assets associated with this virtual URL
    for (const asset of assets) {
      // If it's an uploaded asset, delete the file
      if (asset.type === "uploaded" && asset.path) {
        try {
          await unlink(path.join(__dirname, "..", asset.path))
        } catch (err) {
          console.error(`Error deleting file: ${asset.path}`, err)
        }
      }

      // If it's a cloud asset, delete from cloud storage
      if (asset.type === "cloud" && asset.cloudStorage) {
        try {
          await removeFromCloud(asset.cloudStorage)
        } catch (err) {
          console.error(`Error deleting from cloud: ${asset.cloudStorage.key}`, err)
        }
      }

      // Delete the asset document
      await asset.remove()
    }

    // Remove virtual URL from collection
    const collection = await Collection.findById(virtualUrl.collection)
    if (collection) {
      collection.virtualUrls = collection.virtualUrls.filter((url) => url.toString() !== virtualUrl._id.toString())
      await collection.save()

      // Update collection storage
      await collection.updateStorageUsed()
    }

    // Delete the virtual URL
    await virtualUrl.remove()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get assets for a virtual URL
// @route   GET /api/virtual-urls/:id/assets
// @access  Private
exports.getVirtualUrlAssets = async (req, res, next) => {
  try {
    const virtualUrl = await VirtualUrl.findById(req.params.id)

    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the virtual URL
    if (virtualUrl.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to access this virtual URL`, 403))
    }

    // Get assets for the virtual URL
    const assets = await Asset.find({ virtualUrl: virtualUrl._id }).sort({ version: -1 })

    res.status(200).json({
      success: true,
      count: assets.length,
      data: {
        assets,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Set up A/B testing for a virtual URL
// @route   PUT /api/virtual-urls/:id/ab-testing
// @access  Private
exports.setupABTesting = async (req, res, next) => {
  try {
    const virtualUrl = await VirtualUrl.findById(req.params.id)

    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the virtual URL
    if (virtualUrl.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to update this virtual URL`, 403))
    }

    // Validate request body
    const { enabled, variants } = req.body

    if (enabled && (!variants || !Array.isArray(variants) || variants.length < 2)) {
      return next(new ErrorResponse(`A/B testing requires at least 2 variants`, 400))
    }

    // Check that each variant references a valid asset for this virtual URL
    if (enabled) {
      for (const variant of variants) {
        if (!variant.asset || !variant.weight) {
          return next(new ErrorResponse(`Each variant must have an asset ID and weight`, 400))
        }

        // Check asset exists and belongs to this virtual URL
        const asset = await Asset.findOne({
          _id: variant.asset,
          virtualUrl: virtualUrl._id,
        })

        if (!asset) {
          return next(new ErrorResponse(`Asset not found or not associated with this virtual URL`, 404))
        }
      }

      // Validate total weight is 100%
      const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0)
      if (Math.abs(totalWeight - 100) > 0.01) {
        // Allow a small rounding error
        return next(new ErrorResponse(`Total weight of variants must be 100%, got ${totalWeight}%`, 400))
      }
    }

    // Update A/B testing configuration
    virtualUrl.abTesting = {
      enabled: !!enabled,
      variants: enabled ? variants : [],
    }

    await virtualUrl.save()

    res.status(200).json({
      success: true,
      data: {
        virtualUrl,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Schedule an asset to become active at a future date
// @route   PUT /api/virtual-urls/:id/schedule
// @access  Private
exports.scheduleAsset = async (req, res, next) => {
  try {
    const virtualUrl = await VirtualUrl.findById(req.params.id)

    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the virtual URL
    if (virtualUrl.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to update this virtual URL`, 403))
    }

    // Validate request body
    const { asset, activationDate } = req.body

    if (!asset || !activationDate) {
      return next(new ErrorResponse(`Please provide asset ID and activation date`, 400))
    }

    // Validate activation date is in the future
    const activationTimestamp = new Date(activationDate).getTime()
    if (isNaN(activationTimestamp) || activationTimestamp <= Date.now()) {
      return next(new ErrorResponse(`Activation date must be in the future`, 400))
    }

    // Check asset exists and belongs to this virtual URL
    const assetDoc = await Asset.findOne({
      _id: asset,
      virtualUrl: virtualUrl._id,
    })

    if (!assetDoc) {
      return next(new ErrorResponse(`Asset not found or not associated with this virtual URL`, 404))
    }

    // Update scheduled asset
    virtualUrl.scheduledAsset = {
      asset,
      activationDate: new Date(activationDate),
    }

    // Update status to scheduled
    virtualUrl.status = "scheduled"

    await virtualUrl.save()

    res.status(200).json({
      success: true,
      data: {
        virtualUrl,
      },
    })
  } catch (err) {
    next(err)
  }
}
