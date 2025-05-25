const AccessLog = require("../models/AccessLog")
const VirtualUrl = require("../models/VirtualUrl")
const Asset = require("../models/Asset")
const Collection = require("../models/Collection")
const ErrorResponse = require("../utils/errorResponse")
const moment = require("moment")

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const collectionCount = await Collection.countDocuments({ user: req.user.id })
    const virtualUrlCount = await VirtualUrl.countDocuments({ user: req.user.id })

    // Get total storage used
    const user = req.user
    const storageUsed = user.storageUsed
    const storagePercentage = Math.round((storageUsed / user.storageQuota) * 100)

    // Get total requests in the last 30 days
    const thirtyDaysAgo = moment().subtract(30, "days").toDate()
    const accessLogs = await AccessLog.find({
      user: req.user.id,
      createdAt: { $gte: thirtyDaysAgo },
    })

    const totalRequests = accessLogs.length

    // Requests over time (last 30 days)
    const requestsOverTime = await AccessLog.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Total bandwidth used
    const totalBandwidth = accessLogs.reduce((total, log) => total + (log.bandwidth || 0), 0)

    // Storage usage by collection
    const storageByCollection = await Collection.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $project: {
          name: 1,
          storageUsed: 1,
        },
      },
      {
        $sort: { storageUsed: -1 },
      },
    ])

    // Top accessed virtual URLs
    const topVirtualUrls = await VirtualUrl.find({ user: req.user.id })
      .sort({ accessCount: -1 })
      .limit(5)
      .populate("collection", "name")

    res.status(200).json({
      success: true,
      data: {
        stats: {
          collectionCount,
          virtualUrlCount,
          storageUsed,
          storageQuota: user.storageQuota,
          storagePercentage,
          totalRequests,
          totalBandwidth,
          requestsOverTime: requestsOverTime.map((item) => ({
            date: item._id,
            count: item.count,
          })),
          storageByCollection: storageByCollection.map((item) => ({
            name: item.name,
            storageUsed: item.storageUsed,
          })),
          topVirtualUrls: topVirtualUrls.map((url) => ({
            id: url._id,
            path: url.path,
            fullPath: url.fullPath,
            collection: url.collection ? url.collection.name : "Unknown",
            accessCount: url.accessCount,
          })),
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get access logs
// @route   GET /api/analytics/access-logs
// @access  Private
exports.getAccessLogs = async (req, res, next) => {
  try {
    // Build query
    const query = { user: req.user.id }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      }
    } else if (req.query.startDate) {
      query.createdAt = { $gte: new Date(req.query.startDate) }
    } else if (req.query.endDate) {
      query.createdAt = { $lte: new Date(req.query.endDate) }
    }

    // Filter by virtual URL
    if (req.query.virtualUrl) {
      query.virtualUrl = req.query.virtualUrl
    }

    // Filter by asset
    if (req.query.asset) {
      query.asset = req.query.asset
    }

    // Filter by country
    if (req.query.country) {
      query.country = req.query.country
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 50
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await AccessLog.countDocuments(query)

    const logs = await AccessLog.find(query)
      .populate({
        path: "virtualUrl",
        select: "path fullPath collection",
        populate: {
          path: "collection",
          select: "name",
        },
      })
      .populate("asset", "name contentType version")
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })

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
      count: logs.length,
      pagination,
      total,
      data: {
        logs,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get geographic distribution of requests
// @route   GET /api/analytics/geography
// @access  Private
exports.getGeographicStats = async (req, res, next) => {
  try {
    // Filter by date range
    let dateFilter = {}
    if (req.query.startDate && req.query.endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.endDate),
        },
      }
    } else if (req.query.startDate) {
      dateFilter = { createdAt: { $gte: new Date(req.query.startDate) } }
    } else if (req.query.endDate) {
      dateFilter = { createdAt: { $lte: new Date(req.query.endDate) } }
    } else {
      // Default to last 30 days
      dateFilter = {
        createdAt: { $gte: moment().subtract(30, "days").toDate() },
      }
    }

    // Get country distribution
    const countryStats = await AccessLog.aggregate([
      {
        $match: {
          user: req.user._id,
          country: { $ne: null },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get region distribution (for top countries)
    const topCountries = countryStats.slice(0, 5).map((stat) => stat._id)

    const regionStats = await AccessLog.aggregate([
      {
        $match: {
          user: req.user._id,
          country: { $in: topCountries },
          region: { $ne: null },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: {
            country: "$country",
            region: "$region",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Total requests for percentage calculation
    const totalRequests = countryStats.reduce((total, stat) => total + stat.count, 0)

    res.status(200).json({
      success: true,
      data: {
        countries: countryStats.map((stat) => ({
          country: stat._id,
          count: stat.count,
          percentage: Math.round((stat.count / totalRequests) * 100),
        })),
        regions: regionStats.map((stat) => ({
          country: stat._id.country,
          region: stat._id.region,
          count: stat.count,
        })),
        total: totalRequests,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get top assets by access count
// @route   GET /api/analytics/top-assets
// @access  Private
exports.getTopAssets = async (req, res, next) => {
  try {
    // Filter by date range
    let dateFilter = {}
    if (req.query.startDate && req.query.endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.endDate),
        },
      }
    } else if (req.query.startDate) {
      dateFilter = { createdAt: { $gte: new Date(req.query.startDate) } }
    } else if (req.query.endDate) {
      dateFilter = { createdAt: { $lte: new Date(req.query.endDate) } }
    } else {
      // Default to last 30 days
      dateFilter = {
        createdAt: { $gte: moment().subtract(30, "days").toDate() },
      }
    }

    // Limit
    const limit = Number.parseInt(req.query.limit, 10) || 10

    // Get top virtual URLs
    const topVirtualUrls = await AccessLog.aggregate([
      {
        $match: {
          user: req.user._id,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$virtualUrl",
          count: { $sum: 1 },
          bandwidth: { $sum: "$bandwidth" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: limit,
      },
    ])

    // Get virtual URL details
    const virtualUrlIds = topVirtualUrls.map((stat) => stat._id)
    const virtualUrls = await VirtualUrl.find({ _id: { $in: virtualUrlIds } })
      .populate("collection", "name")
      .populate("activeAsset", "name contentType")

    // Merge stats with virtual URL details
    const result = topVirtualUrls.map((stat) => {
      const virtualUrl = virtualUrls.find((url) => url._id.toString() === stat._id.toString())
      return {
        id: stat._id,
        path: virtualUrl ? virtualUrl.path : "Unknown",
        fullPath: virtualUrl ? virtualUrl.fullPath : "Unknown",
        collection: virtualUrl && virtualUrl.collection ? virtualUrl.collection.name : "Unknown",
        contentType: virtualUrl && virtualUrl.activeAsset ? virtualUrl.activeAsset.contentType : "Unknown",
        accessCount: stat.count,
        bandwidth: stat.bandwidth || 0,
      }
    })

    res.status(200).json({
      success: true,
      count: result.length,
      data: {
        assets: result,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get A/B testing statistics
// @route   GET /api/analytics/ab-testing/:virtualUrlId
// @access  Private
exports.getABTestingStats = async (req, res, next) => {
  try {
    const virtualUrl = await VirtualUrl.findById(req.params.virtualUrlId)

    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found with id of ${req.params.virtualUrlId}`, 404))
    }

    // Make sure user owns the virtual URL
    if (virtualUrl.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User not authorized to access this virtual URL`, 403))
    }

    // Check if A/B testing is enabled
    if (!virtualUrl.abTesting || !virtualUrl.abTesting.enabled) {
      return next(new ErrorResponse(`A/B testing is not enabled for this virtual URL`, 400))
    }

    // Get variant assets
    const variantAssets = await Asset.find({
      _id: { $in: virtualUrl.abTesting.variants.map((v) => v.asset) },
    })

    // Filter by date range
    let dateFilter = {}
    if (req.query.startDate && req.query.endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.endDate),
        },
      }
    } else if (req.query.startDate) {
      dateFilter = { createdAt: { $gte: new Date(req.query.startDate) } }
    } else if (req.query.endDate) {
      dateFilter = { createdAt: { $lte: new Date(req.query.endDate) } }
    } else {
      // Default to last 30 days
      dateFilter = {
        createdAt: { $gte: moment().subtract(30, "days").toDate() },
      }
    }

    // Get access counts for each variant
    const variantStats = await AccessLog.aggregate([
      {
        $match: {
          virtualUrl: virtualUrl._id,
          asset: { $in: virtualUrl.abTesting.variants.map((v) => v.asset) },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$asset",
          count: { $sum: 1 },
        },
      },
    ])

    // Total access count
    const totalAccess = variantStats.reduce((total, stat) => total + stat.count, 0)

    // Merge stats with variant details
    const result = virtualUrl.abTesting.variants.map((variant) => {
      const asset = variantAssets.find((a) => a._id.toString() === variant.asset.toString())
      const stat = variantStats.find((s) => s._id.toString() === variant.asset.toString())

      return {
        asset: {
          id: variant.asset,
          name: asset ? asset.name : "Unknown",
          version: asset ? asset.version : "Unknown",
        },
        weight: variant.weight,
        count: stat ? stat.count : 0,
        percentage: totalAccess > 0 ? Math.round(((stat ? stat.count : 0) / totalAccess) * 100) : 0,
      }
    })

    res.status(200).json({
      success: true,
      data: {
        virtualUrl: {
          id: virtualUrl._id,
          path: virtualUrl.path,
          fullPath: virtualUrl.fullPath,
        },
        totalAccess,
        variants: result,
      },
    })
  } catch (err) {
    next(err)
  }
}
