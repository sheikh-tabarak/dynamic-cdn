const mongoose = require("mongoose")

const CloudStorageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a connection name"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["aws", "gcp", "azure", "dropbox", "cloudinary"],
      required: true,
    },
    credentials: {
      // Common
      bucket: String,

      // AWS S3
      accessKeyId: String,
      secretAccessKey: String,
      region: String,

      // Google Cloud Storage
      projectId: String,
      keyFile: String, // JSON stringified

      // Azure Blob Storage
      accountName: String,
      accountKey: String,
      containerName: String,

      // Dropbox
      accessToken: String,
      refreshToken: String,
      expiresAt: Date,

      // Cloudinary
      cloudName: String,
      apiKey: String,
      apiSecret: String
    },
    status: {
      type: String,
      enum: ["connected", "disconnected", "error"],
      default: "connected",
    },
    lastSync: {
      type: Date,
      default: Date.now,
    },
    storageStats: {
      total: Number, // Total space in bytes
      used: Number, // Used space in bytes
      free: Number,
      lastUpdated: Date,
    },
    error: String,
  },
  { timestamps: true },
)

// Encrypt sensitive fields (in a real app, these would be properly encrypted)
CloudStorageSchema.pre("save", (next) => {
  // This is a placeholder for actual encryption
  // In a production environment, use proper encryption for sensitive data
  next()
})

module.exports = mongoose.model("CloudStorage", CloudStorageSchema)
