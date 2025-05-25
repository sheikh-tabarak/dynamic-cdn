const mongoose = require("mongoose")

const VirtualUrlSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: [true, "Please provide a path for the virtual URL"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["image", "video", "document", "audio", "url", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "scheduled"],
      default: "active",
    },
    storageUsed: {
      type: Number, // in bytes
      default: 0,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
    fullPath: String, // Computed field: /v/{collection.pathPrefix}/{path}
    activeAsset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
    },
    targelURL:
    {
      type: String,
      default: "",
    },
    abTesting: {
      enabled: {
        type: Boolean,
        default: false,
      },
      variants: [
        {
          asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
          },
          weight: {
            type: Number,
            default: 50, // Percentage weight
          },
        },
      ],
    },
    scheduledAsset: {
      asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
      },
      activationDate: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Set unique compound index on collection and path
VirtualUrlSchema.index({ collection: 1, path: 1 }, { unique: true })

// Compute full path before saving
VirtualUrlSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("path")) {
      const Collection = mongoose.model("Collection")
      const collection = await Collection.findById(this.collection)

      if (!collection) {
        return next(new Error("Collection not found"))
      }

      const prefix = collection.pathPrefix ? collection.pathPrefix + "/" : ""
      this.fullPath = `/v/${prefix}${this.path}`
    }
    next()
  } catch (error) {
    next(error)
  }
})

// Virtual for assets (all versions)
VirtualUrlSchema.virtual("assets", {
  ref: "Asset",
  localField: "_id",
  foreignField: "virtualUrl",
  justOne: false,
})

// Method to update storage used
VirtualUrlSchema.methods.updateStorageUsed = async function () {
  try {
    const Asset = mongoose.model("Asset")
    const assets = await Asset.find({ virtualUrl: this._id })

    let totalSize = 0
    assets.forEach((asset) => {
      totalSize += asset.size || 0
    })

    this.storageUsed = totalSize
    await this.save()

    // Update collection storage as well
    const Collection = mongoose.model("Collection")
    const collection = await Collection.findById(this.collection)
    if (collection) {
      await collection.updateStorageUsed()
    }

    return this.storageUsed
  } catch (error) {
    console.error("Error updating virtual URL storage:", error)
    throw error
  }
}

// Method to increment access count
VirtualUrlSchema.methods.incrementAccessCount = async function () {
  this.accessCount += 1
  await this.save()
  return this.accessCount
}

module.exports = mongoose.model("VirtualUrl", VirtualUrlSchema)
