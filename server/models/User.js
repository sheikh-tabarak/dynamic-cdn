const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("../config/config")

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    company: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "editor",
    },
    subscriptionPlan: {
      type: String,
      enum: ["starter", "pro", "enterprise"],
      default: "starter",
    },
    storageQuota: {
      type: Number, // in bytes
      default: 5368709120, // 5GB
    },
    storageUsed: {
      type: Number, // in bytes
      default: 0,
    },
    virtualUrlQuota: {
      type: Number,
      default: 50, // 50 URLs for starter plan
    },
    collectionsQuota: {
      type: Number,
      default: 5, // 5 collections for starter plan
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    profileImage: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
  },
  { timestamps: true },
)

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = require("crypto").randomBytes(20).toString("hex")

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = require("crypto").createHash("sha256").update(resetToken).digest("hex")

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

// Update subscription plan limits
UserSchema.methods.updateSubscriptionLimits = function (plan) {
  this.subscriptionPlan = plan

  switch (plan) {
    case "starter":
      this.storageQuota = 5368709120 // 5GB
      this.virtualUrlQuota = 50
      this.collectionsQuota = 5
      break
    case "pro":
      this.storageQuota = 26843545600 // 25GB
      this.virtualUrlQuota = 200
      this.collectionsQuota = 20
      break
    case "enterprise":
      this.storageQuota = 107374182400 // 100GB
      this.virtualUrlQuota = 9999 // Unlimited (practically)
      this.collectionsQuota = 9999 // Unlimited (practically)
      break
    default:
      break
  }
}

module.exports = mongoose.model("User", UserSchema)
