const jwt = require("jsonwebtoken")
const config = require("../config/config")
const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const Collection = require("../models/Collection")
const VirtualUrl = require("../models/VirtualUrl")
// Protect routes
exports.protect = async (req, res, next) => {
  let token

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Set token from Bearer token
    token = req.headers.authorization.split(" ")[1]
  }
  // Check for token
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401))
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret)

    // Add user to request
    req.user = await User.findById(decoded.id)

    if (!req.user) {
      return next(new ErrorResponse("User not found", 404))
    }

    next()
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401))
  }
}

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }
    next()
  }
}

// Check if user has enough storage quota
exports.checkStorageQuota = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    // If the request includes a file or size information
    if (req.file || req.body.size) {
      const fileSize = req.file ? req.file.size : Number.parseInt(req.body.size, 10)

      if (user.storageUsed + fileSize > user.storageQuota) {
        return next(new ErrorResponse("Storage quota exceeded. Please upgrade your plan or free up space.", 403))
      }
    }

    next()
  } catch (err) {
    next(err)
  }
}

// Check if user has enough virtual URL quota
exports.checkVirtualUrlQuota = async (req, res, next) => {
  try {
    // Only check for new URL creation
    if (req.method === "POST") {
      // const { VirtualUrl } = require("../models")
      const user = await User.findById(req.user.id)
      const virtualUrlCount = await VirtualUrl.countDocuments({ user: user._id })

      if (virtualUrlCount >= user.virtualUrlQuota) {
        return next(new ErrorResponse("Virtual URL quota exceeded. Please upgrade your plan.", 403))
      }
    }

    next()
  } catch (err) {
    next(err)
  }
}

// Check if user has enough collections quota
exports.checkCollectionsQuota = async (req, res, next) => {
  try {
    // Only check for new collection creation
    if (req.method === "POST") {

      const user = await User.findById(req.user.id)
      const collectionsCount = await Collection.countDocuments({ user: user._id })

      if (collectionsCount >= user.collectionsQuota) {
        return next(new ErrorResponse("Collections quota exceeded. Please upgrade your plan.", 403))
      }
    }

    next()
  } catch (err) {
    next(err)
  }
}
