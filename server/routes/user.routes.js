const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middleware/auth")
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
} = require("../controllers/user.controller")

// Routes that require authentication
router.use(protect)

// Get current user profile
router.get("/profile", getUserProfile)

// Update current user profile
router.put("/profile", updateUserProfile)

// Update password
router.put("/password", updatePassword)

// Admin only routes
router.use(authorize("admin"))

// Get all users
router.get("/", getUsers)

// Get, update, delete specific user
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
