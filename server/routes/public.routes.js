const express = require("express")
const VirtualUrl = require("../models/VirtualUrl")
const Asset = require("../models/Asset")
const Collection = require("../models/Collection")
const AccessLog = require("../models/AccessLog")
const ErrorResponse = require("../utils/errorResponse")
//const { getRequestLocation } = require("../utils/location")
const router = express.Router()

// @desc    Serve assets via virtual URL
// @route   GET /v/:path
// @access  Public
router.get("/:path(*)", async (req, res, next) => {
  try {
    const path = req.params.path

    // Split path into segments
    const segments = path.split("/")

    // Check if this is a collection path
    const firstSegment = segments[0]

    let collection
    let virtualUrl

    // Try to find a collection with this path prefix
    collection = await Collection.findOne({ pathPrefix: firstSegment })

    if (collection) {
      // If collection found, look for virtual URL in this collection
      const remainingPath = segments.slice(1).join("/")
      virtualUrl = await VirtualUrl.findOne({
        collection: collection._id,
        path: remainingPath,
      })
    } else {
      // If no collection prefix match, look for a direct virtual URL match
      virtualUrl = await VirtualUrl.findOne({
        path: path,
      })
    }

    if (!virtualUrl) {
      return next(new ErrorResponse(`Virtual URL not found`, 404))
    }

    // Check status
    if (virtualUrl.status === "inactive") {
      return next(new ErrorResponse(`This virtual URL is inactive`, 404))
    }

    // Check for scheduled assets
    if (virtualUrl.status === "scheduled" && virtualUrl.scheduledAsset) {
      const now = new Date()
      const activationDate = new Date(virtualUrl.scheduledAsset.activationDate)

      if (now >= activationDate) {
        // Activate the scheduled asset
        virtualUrl.activeAsset = virtualUrl.scheduledAsset.asset
        virtualUrl.status = "active"
        virtualUrl.scheduledAsset = undefined
        await virtualUrl.save()
      }
    }

    // Determine which asset to serve
    let assetToServe

    // A/B testing
    if (virtualUrl.abTesting && virtualUrl.abTesting.enabled && virtualUrl.abTesting.variants.length > 0) {
      // Simple random weighted selection
      const variants = virtualUrl.abTesting.variants
      const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0)
      let random = Math.random() * totalWeight

      for (const variant of variants) {
        random -= variant.weight
        if (random <= 0) {
          assetToServe = await Asset.findById(variant.asset)
          break
        }
      }

      // Fallback to active asset if no variant selected (shouldn't happen)
      if (!assetToServe) {
        assetToServe = await Asset.findById(virtualUrl.activeAsset)
      }
    } else {
      // Use active asset
      assetToServe = await Asset.findById(virtualUrl.activeAsset)
    }

    if (!assetToServe) {
      return next(new ErrorResponse(`No active asset found for this virtual URL`, 404))
    }

    // Log the access
    const location = 'test'
//      await getRequestLocation(req.ip)
    const accessLog = new AccessLog({
      virtualUrl: virtualUrl._id,
      asset: assetToServe._id,
      user: virtualUrl.user,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      referer: req.headers.referer,
      country: location.country,
      region: location.region,
      city: location.city,
      responseStatus: 200,
      bandwidth: assetToServe.size || 0,
      abTestVariant: assetToServe._id.toString() !== virtualUrl.activeAsset.toString() ? "variant" : "control",
    })

    // Save access log asynchronously (don't wait for it)
    accessLog.save().catch((err) => console.error("Error saving access log:", err))

    // Increment access counts asynchronously
    Promise.all([virtualUrl.incrementAccessCount(), assetToServe.incrementAccessCount()]).catch((err) =>
      console.error("Error incrementing access counts:", err),
    )

    // Serve the asset
    switch (assetToServe.type) {
      case "uploaded":
        // Check if the file exists on local filesystem
        const filePath = path.join(__dirname, "..", assetToServe.path)
        res.setHeader("Content-Type", assetToServe.contentType)
        res.sendFile(filePath)
        break

      case "external":
        res.redirect(assetToServe.externalUrl)
        break

      case "cloud":
        if (assetToServe.cloudStorage && assetToServe.cloudStorage.url) {
          res.redirect(assetToServe.cloudStorage.url)
        } else {
          // Generate a temporary URL using cloud storage provider
          const { getCloudStorageProvider } = require("../utils/cloudStorage")
          const provider = await getCloudStorageProvider(assetToServe.cloudStorage.provider, virtualUrl.user)

          const url = await provider.getSignedUrl(assetToServe.cloudStorage.bucket, assetToServe.cloudStorage.key)

          res.redirect(url)
        }
        break

      default:
        return next(new ErrorResponse(`Invalid asset type`, 500))
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
