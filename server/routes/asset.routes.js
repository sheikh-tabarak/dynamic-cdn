const express = require("express")
const {
  uploadAsset,
  addExternalAsset,
  addCloudAsset,
  getAssets,
  getAsset,
  updateAsset,
  deleteAsset,
  setActiveAsset,
  upload,
} = require("../controllers/asset.controller")

const router = express.Router()

const { protect, checkStorageQuota } = require("../middleware/auth")

router.route("/").get(protect, getAssets)

router.route("/:id").get(protect, getAsset).put(protect, updateAsset).delete(protect, deleteAsset)

router.route("/upload/:virtualUrlId").post(protect, checkStorageQuota, upload.single("file"), uploadAsset)

router.route("/external/:virtualUrlId").post(protect, addExternalAsset)

router.route("/cloud/:virtualUrlId").post(protect, addCloudAsset)

router.route("/:id/set-active").put(protect, setActiveAsset)

module.exports = router
