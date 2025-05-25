import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { DashboardProvider } from "./contexts/DashboardContext"
import DashboardLayout from "./layouts/DashboardLayout"
import Dashboard from "./pages/Dashboard"
import Collections from "./pages/Collections"
import CollectionDetails from "./pages/CollectionDetails"
import NewCollection from "./pages/NewCollection"
import NewVirtualUrl from "./pages/NewVirtualUrl"
import VirtualUrls from "./pages/VirtualUrls"
import CloudStorage from "./pages/CloudStorage"
import ConnectCloudStorage from "./pages/ConnectCloudStorage"
import Analytics from "./pages/Analytics"
import Settings from "./pages/Settings"
import "./App.css"
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./pages/Login"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DashboardProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/collections" element={<Collections />} />
              <Route path="dashboard/collections/new" element={<NewCollection />} />
              <Route path="dashboard/collections/:id" element={<CollectionDetails />} />
              <Route path="dashboard/collections/:id/virtual-urls/new" element={<NewVirtualUrl />} />
              <Route path="dashboard/virtual-urls" element={<VirtualUrls />} />
              <Route path="dashboard/virtual-urls/new" element={<NewVirtualUrl />} />
              <Route path="dashboard/cloud-storage" element={<CloudStorage />} />
              <Route path="dashboard/cloud-storage/connect" element={<ConnectCloudStorage />} />
              <Route path="dashboard/analytics" element={<Analytics />} />
              <Route path="dashboard/settings" element={<Settings />} />
            </Route>
          </Routes>
        </DashboardProvider>
      </ThemeProvider>
    </AuthProvider>

  )
}

export default App
