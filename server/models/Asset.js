const mongoose = require("mongoose")

const AssetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide an asset name"],
      trim: true,
    },
    virtualUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VirtualUrl",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["uploaded", "external", "cloud"],
      required: true,
    },
    contentType: {
      type: String, // MIME type
      required: true,
    },
    size: {
      type: Number, // Size in bytes
      default: 0,
    },
    path: String, // Local file path or URL
    metadata: {
      width: Number,
      height: Number,
      duration: Number, // For audio/video
      pages: Number, // For documents
      format: String, // File format
    },
    cloudStorage: {
      provider: {
        type: String,
        enum: ["aws", "gcp", "azure", "dropbox", ""],
      },
      bucket: String,
      key: String,
      url: String,
    },
    externalUrl: String, // For type: 'external'
    version: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

// Pre-save hook to auto-increment version
AssetSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const latestAsset = await this.constructor.findOne(
        { virtualUrl: this.virtualUrl },
        { version: 1 },
        { sort: { version: -1 } },
      )

      if (latestAsset) {
        this.version = latestAsset.version + 1
      }
    }
    next()
  } catch (error) {
    next(error)
  }
})

// Post-save hook to update the VirtualUrl storage and activeAsset if needed
AssetSchema.post("save", async (doc) => {
  try {
    const VirtualUrl = mongoose.model("VirtualUrl")
    const virtualUrl = await VirtualUrl.findById(doc.virtualUrl)

    if (virtualUrl) {
      await virtualUrl.updateStorageUsed()

      // If this is marked as active or there's no active asset yet, set it as active
      if (doc.isActive || !virtualUrl.activeAsset) {
        virtualUrl.activeAsset = doc._id
        await virtualUrl.save()
      }
    }
  } catch (error) {
    console.error("Error in Asset post-save hook:", error)
  }
})

// Method to increment access count
AssetSchema.methods.incrementAccessCount = async function () {
  this.accessCount += 1
  await this.save()
  return this.accessCount
}

module.exports = mongoose.model("Asset", AssetSchema)
