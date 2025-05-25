const express = require("express")
const {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionVirtualUrls,
  getCollectionStats,
} = require("../controllers/collection.controller")

const router = express.Router()

const { protect, checkCollectionsQuota } = require("../middleware/auth")

router.route("/").get(protect, getCollections).post(protect, checkCollectionsQuota, createCollection)

router.route("/:id").get(protect, getCollection).put(protect, updateCollection).delete(protect, deleteCollection)

router.route("/:id/virtual-urls").get(protect, getCollectionVirtualUrls)

router.route("/:id/stats").get(protect, getCollectionStats)

module.exports = router