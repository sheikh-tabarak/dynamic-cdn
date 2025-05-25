const Collection = require("../models/Collection")
const VirtualUrl = require("../models/VirtualUrl")
const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Get all collections for the logged-in user
// @route   GET /api/collections
// @access  Private
exports.getCollections = async (req, res, next) => {
  try {
    // Add query params for filtering if needed
    const query = { user: req.user.id }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ]
    }

    const collections = await Collection.find(query).sort({ createdAt: -1 })

    // Get virtual URL count for each collection
    for (const collection of collections) {
      collection._doc.virtualUrlCount = await VirtualUrl.countDocuments({ collection: collection._id })
    }

    res.status(200).json({
      success: true,
      count: collections.length,
      data: {
        collections,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single collection
// @route   GET /api/collections/:id
// @access  Private
exports.getCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id)

    if (!collection) {
      return next(new ErrorResponse(`Collection not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the collection
    if (collection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to access this collection`, 403))
    }

    // Get virtual URL count
    collection._doc.virtualUrlCount = await VirtualUrl.countDocuments({ collection: collection._id })

    res.status(200).json({
      success: true,
      data: {
        collection,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private
exports.createCollection = async (req, res, next) => {
  try {
    // Check if user has reached collections quota
    const collectionsCount = await Collection.countDocuments({ user: req.user.id })
    const user = await User.findById(req.user.id)

    if (collectionsCount >= user.collectionsQuota) {
      return next(new ErrorResponse(`Collections quota exceeded. Please upgrade your plan.`, 403))
    }

    // Add user to request body
    req.body.user = req.user.id

    const collection = await Collection.create(req.body)

    res.status(201).json({
      success: true,
      data: {
        collection,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private
exports.updateCollection = async (req, res, next) => {
  try {
    let collection = await Collection.findById(req.params.id)

    if (!collection) {
      return next(new ErrorResponse(`Collection not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the collection
    if (collection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to update this collection`, 403))
    }

    collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: {
        collection,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private
exports.deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id)

    if (!collection) {
      return next(new ErrorResponse(`Collection not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the collection
    if (collection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to delete this collection`, 403))
    }

    // Check if collection has virtual URLs
    const virtualUrlCount = await VirtualUrl.countDocuments({ collection: collection._id })
    if (virtualUrlCount > 0) {
      return next(
        new ErrorResponse(
          `Cannot delete collection with ${virtualUrlCount} virtual URLs. Delete virtual URLs first.`,
          400,
        ),
      )
    }

    await Collection.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get virtual URLs for a collection
// @route   GET /api/collections/:id/virtual-urls
// @access  Private
exports.getCollectionVirtualUrls = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id)

    if (!collection) {
      return next(new ErrorResponse(`Collection not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the collection
    if (collection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to access this collection`, 403))
    }

    // Query params
    const query = { collection: collection._id }

    if (req.query.search) {
      query.$or = [
        { path: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ]
    }

    if (req.query.status) {
      query.status = req.query.status
    }

    // Get virtual URLs for the collection
    const virtualUrls = await VirtualUrl.find(query)
      .sort({ createdAt: -1 })
      .populate("activeAsset", "name contentType size path type")

    res.status(200).json({
      success: true,
      count: virtualUrls.length,
      data: {
        virtualUrls,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get collection statistics
// @route   GET /api/collections/:id/stats
// @access  Private
exports.getCollectionStats = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id)

    if (!collection) {
      return next(new ErrorResponse(`Collection not found with id of ${req.params.id}`, 404))
    }

    // Make sure user owns the collection
    if (collection.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to access this collection`, 403))
    }

    // Get virtual URL count
    const virtualUrlCount = await VirtualUrl.countDocuments({ collection: collection._id })

    // Get content type distribution
    const contentTypeDistribution = await VirtualUrl.aggregate([
      { $match: { collection: collection._id } },
      { $group: { _id: "$contentType", count: { $sum: 1 } } },
    ])

    // Get total access count
    const totalAccess = await VirtualUrl.aggregate([
      { $match: { collection: collection._id } },
      { $group: { _id: null, total: { $sum: "$accessCount" } } },
    ])

    // Update storage used
    await collection.updateStorageUsed()

    res.status(200).json({
      success: true,
      data: {
        stats: {
          virtualUrlCount,
          storageUsed: collection.storageUsed,
          contentTypeDistribution: contentTypeDistribution.map((item) => ({
            type: item._id,
            count: item.count,
          })),
          totalAccess: totalAccess.length > 0 ? totalAccess[0].total : 0,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}
