const express = require("express")
const {
  getVirtualUrls,
  getVirtualUrl,
  createVirtualUrl,
  updateVirtualUrl,
  deleteVirtualUrl,
  getVirtualUrlAssets,
  setupABTesting,
  scheduleAsset,
} = require("../controllers/virtualUrl.controller")

const router = express.Router()

const { protect, checkVirtualUrlQuota } = require("../middleware/auth")

router.route("/").get(protect, getVirtualUrls).post(protect, checkVirtualUrlQuota, createVirtualUrl)

router.route("/:id").get(protect, getVirtualUrl).put(protect, updateVirtualUrl).delete(protect, deleteVirtualUrl)

router.route("/:id/assets").get(protect, getVirtualUrlAssets)

router.route("/:id/ab-testing").put(protect, setupABTesting)

router.route("/:id/schedule").put(protect, scheduleAsset)

module.exports = router
