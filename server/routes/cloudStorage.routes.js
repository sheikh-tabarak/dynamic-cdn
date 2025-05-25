const express = require("express")
const {
  getCloudStorageConnections,
  getCloudStorageConnection,
  createCloudStorageConnection,
  updateCloudStorageConnection,
  deleteCloudStorageConnection,
  syncCloudStorageConnection,
  listCloudStorageFiles,
} = require("../controllers/cloudStorage.controller")

const router = express.Router()

const { protect } = require("../middleware/auth")

router.route("/").get(protect, getCloudStorageConnections).post(protect, createCloudStorageConnection)

router
  .route("/:id")
  .get(protect, getCloudStorageConnection)
  .put(protect, updateCloudStorageConnection)
  .delete(protect, deleteCloudStorageConnection)

router.route("/:id/sync").put(protect, syncCloudStorageConnection)

router.route("/:id/files").get(protect, listCloudStorageFiles)

module.exports = router
