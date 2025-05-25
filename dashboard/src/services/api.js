import axios from "axios"
// import { useAuth } from "../contexts/AuthContext";

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
})



// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    // const { token } = useAuth();
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth services


// const token = localStorage.getItem("token")
export const authService = {

  
  login: (credentials) => api.post("/auth/login",credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/updatedetails", userData),
  updatePassword: (passwordData) => api.put("/auth/updatepassword", passwordData),
  forgotPassword: (email) => api.post("/auth/forgotpassword", { email }),
  resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password }),
}

// Collection services
export const collectionService = {
  getCollections: (params) => api.get("/collections", { params }),
  getCollection: (id) => api.get(`/collections/${id}`),
  createCollection: (collectionData) => api.post("/collections", collectionData),
  updateCollection: (id, collectionData) => api.put(`/collections/${id}`, collectionData),
  deleteCollection: (id) => api.delete(`/collections/${id}`),
  getCollectionVirtualUrls: (id, params) => api.get(`/collections/${id}/virtual-urls`, { params }),
  getCollectionStats: (id) => api.get(`/collections/${id}/stats`),
}

// Virtual URL services
export const virtualUrlService = {
  getVirtualUrls: (params) => api.get("/virtual-urls", { params }),
  getVirtualUrl: (id) => api.get(`/virtual-urls/${id}`),
  createVirtualUrl: (virtualUrlData) => api.post("/virtual-urls", virtualUrlData),
  updateVirtualUrl: (id, virtualUrlData) => api.put(`/virtual-urls/${id}`, virtualUrlData),
  deleteVirtualUrl: (id) => api.delete(`/virtual-urls/${id}`),
  getVirtualUrlAssets: (id) => api.get(`/virtual-urls/${id}/assets`),
  setupABTesting: (id, abTestingData) => api.put(`/virtual-urls/${id}/ab-testing`, abTestingData),
  scheduleAsset: (id, scheduleData) => api.put(`/virtual-urls/${id}/schedule`, scheduleData),
}

// Asset services
export const assetService = {
  getAssets: (params) => api.get("/assets", { params }),
  getAsset: (id) => api.get(`/assets/${id}`),
  updateAsset: (id, assetData) => api.put(`/assets/${id}`, assetData),
  deleteAsset: (id) => api.delete(`/assets/${id}`),
  uploadAsset: (virtualUrlId, formData) => {
    return api.post(`/assets/upload/${virtualUrlId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  addExternalAsset: (virtualUrlId, assetData) => api.post(`/assets/external/${virtualUrlId}`, assetData),
  addCloudAsset: (virtualUrlId, assetData) => api.post(`/assets/cloud/${virtualUrlId}`, assetData),
  setActiveAsset: (id) => api.put(`/assets/${id}/set-active`),
}

// Cloud Storage services
export const cloudStorageService = {
  getConnections: () => api.get("/cloud-storage"),
  getConnection: (id) => api.get(`/cloud-storage/${id}`),
  createConnection: (connectionData) => api.post("/cloud-storage", connectionData),
  updateConnection: (id, connectionData) => api.put(`/cloud-storage/${id}`, connectionData),
  deleteConnection: (id) => api.delete(`/cloud-storage/${id}`),
  syncConnection: (id) => api.put(`/cloud-storage/${id}/sync`),
  listFiles: (id, prefix) => api.get(`/cloud-storage/${id}/files`, { params: { prefix } }),
}

// Analytics services
export const analyticsService = {
  getDashboardStats: () => api.get("/analytics/dashboard"),
  getAccessLogs: (params) => api.get("/analytics/access-logs", { params }),
  getGeographicStats: (params) => api.get("/analytics/geography", { params }),
  getTopAssets: (params) => api.get("/analytics/top-assets", { params }),
  getABTestingStats: (virtualUrlId, params) => api.get(`/analytics/ab-testing/${virtualUrlId}`, { params }),
}

export default api
