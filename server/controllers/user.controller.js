const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("express-async-handler")

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password")
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  })
})

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password")

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password")

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
  }

  await user.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password")

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  // Fields to update
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select("-password")

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  // Check current password
  const isMatch = await user.matchPassword(req.body.currentPassword)

  if (!isMatch) {
    return next(new ErrorResponse("Current password is incorrect", 401))
  }

  user.password = req.body.newPassword
  await user.save()

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  })
})
