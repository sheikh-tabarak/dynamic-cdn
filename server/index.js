const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const path = require("path")

// Import routes
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const collectionRoutes = require("./routes/collection.routes")
const virtualUrlRoutes = require("./routes/virtualUrl.routes")
const cloudStorageRoutes = require("./routes/cloudStorage.routes")
const analyticsRoutes = require("./routes/analytics.routes")
const assetRoutes = require("./routes/asset.routes")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(morgan("dev"))

// Static files for asset serving
app.use("/v", express.static(path.join(__dirname, "public/assets")))

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/collections", collectionRoutes)
app.use("/api/virtual-urls", virtualUrlRoutes)
app.use("/api/cloud-storage", cloudStorageRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/assets", assetRoutes)

// Public endpoint to access virtual URLs
app.use("/v/:virtualUrlPath", require("./routes/public.routes"))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err)
    process.exit(1)
  })

module.exports = app
