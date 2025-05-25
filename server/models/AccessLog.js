const mongoose = require("mongoose")

const AccessLogSchema = new mongoose.Schema(
  {
    virtualUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VirtualUrl",
      required: true,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ip: String,
    userAgent: String,
    referer: String,
    country: String,
    region: String,
    city: String,
    responseTime: Number, // in milliseconds
    responseStatus: Number, // HTTP status code
    bandwidth: Number, // bytes served
    abTestVariant: String, // If applicable
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
AccessLogSchema.index({ virtualUrl: 1, createdAt: -1 })
AccessLogSchema.index({ asset: 1, createdAt: -1 })
AccessLogSchema.index({ user: 1, createdAt: -1 })
AccessLogSchema.index({ createdAt: -1 })

module.exports = mongoose.model("AccessLog", AccessLogSchema)
