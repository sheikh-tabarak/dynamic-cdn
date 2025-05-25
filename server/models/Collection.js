const mongoose = require("mongoose")

const CollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a collection name"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    pathPrefix: {
      type: String,
      trim: true,
      default: "",
    },
    virtualUrls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VirtualUrl",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storageUsed: {
      type: Number, // in bytes
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    accessToken: {
      type: String, // For protected collections
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Create slug from name
CollectionSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-")

    // Append timestamp to make it unique
    if (!this.slug) {
      this.slug = Date.now().toString()
    } else {
      this.slug = `${this.slug}-${Date.now().toString().slice(-6)}`
    }
  }
  next()
})

// Virtual for virtual URL count
CollectionSchema.virtual("virtualUrlCount").get(function () {
  return this.virtualUrls ? this.virtualUrls.length : 0
})

// Method to update storage used
CollectionSchema.methods.updateStorageUsed = async function () {
  try {
    const VirtualUrl = mongoose.model("VirtualUrl")
    const urls = await VirtualUrl.find({ _id: { $in: this.virtualUrls } })

    let totalSize = 0
    urls.forEach((url) => {
      totalSize += url.storageUsed || 0
    })

    this.storageUsed = totalSize
    await this.save()

    return this.storageUsed
  } catch (error) {
    console.error("Error updating collection storage:", error)
    throw error
  }
}

module.exports = mongoose.model("Collection", CollectionSchema)
