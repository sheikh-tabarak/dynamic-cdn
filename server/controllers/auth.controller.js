const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, company } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return next(new ErrorResponse("Email already in use", 400))
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      company,
    })

    // Generate and send verification email
    const verificationToken = user.getResetPasswordToken() // Reusing this method for verification
    await user.save({ validateBeforeSave: false })

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get("host")}/api/auth/verify-email/${verificationToken}`
    const message = `Please verify your email by clicking on the link: \n\n ${verificationUrl}`

//    try {
//      await sendEmail({
//        email: user.email,
//        subject: "Email Verification",
//        message,
//      })
//    } catch (err) {
//      user.resetPasswordToken = undefined
//      user.resetPasswordExpire = undefined
//      await user.save({ validateBeforeSave: false })
//      return next(new ErrorResponse("Email could not be sent", 500))
//    }

    sendTokenResponse(user, 201, res)
  } catch (err) {
    next(err)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    console.log(req.body)
    const { email, password } = req.body

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse("Please provide an email and password", 400))
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401))
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return next(new ErrorResponse("Invalid password", 401))
    }

    // Update last login
    user.lastLogin = Date.now()
    await user.save({ validateBeforeSave: false })

    sendTokenResponse(user, 200, res)
  } catch (err) {
    next(err)
  }
}

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return next(new ErrorResponse("Invalid token", 400))
    }

    // Set emailVerified to true
    user.emailVerified = true
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          company: user.company,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan,
          storageQuota: user.storageQuota,
          storageUsed: user.storageUsed,
          virtualUrlQuota: user.virtualUrlQuota,
          collectionsQuota: user.collectionsQuota,
          emailVerified: user.emailVerified,
          profileImage: user.profileImage,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
    }

    // Filter out undefined values
    Object.keys(fieldsToUpdate).forEach((key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key])

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          company: user.company,
          role: user.role,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return next(new ErrorResponse("Please provide current and new password", 400))
    }

    const user = await User.findById(req.user.id).select("+password")

    // Check current password
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return next(new ErrorResponse("Current password is incorrect", 401))
    }

    user.password = newPassword
    await user.save()

    sendTokenResponse(user, 200, res)
  } catch (err) {
    next(err)
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return next(new ErrorResponse("There is no user with that email", 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/resetpassword/${resetToken}`
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the link to reset your password: \n\n ${resetUrl}`

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token",
        message,
      })

      res.status(200).json({
        success: true,
        message: "Email sent",
        data: {},
      })
    } catch (err) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save({ validateBeforeSave: false })
      return next(new ErrorResponse("Email could not be sent", 500))
    }
  } catch (err) {
    next(err)
  }
}

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resettoken).digest("hex")

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return next(new ErrorResponse("Invalid token", 400))
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendTokenResponse(user, 200, res)
  } catch (err) {
    next(err)
  }
}

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  })
}
