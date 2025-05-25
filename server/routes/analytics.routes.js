const express = require("express")
const {
  getDashboardStats,
  getAccessLogs,
  getGeographicStats,
  getTopAssets,
  getABTestingStats,
} = require("../controllers/analytics.controller")

const router = express.Router()

const { protect } = require("../middleware/auth")

router.route("/dashboard").get(protect, getDashboardStats)

router.route("/access-logs").get(protect, getAccessLogs)

router.route("/geography").get(protect, getGeographicStats)

router.route("/top-assets").get(protect, getTopAssets)

router.route("/ab-testing/:virtualUrlId").get(protect, getABTestingStats)

module.exports = router
