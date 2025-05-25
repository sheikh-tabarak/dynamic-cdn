import { createContext, useContext, useState } from "react"

const DashboardContext = createContext({
  sidebarOpen: false,
  setSidebarOpen: () => {},
})

export function DashboardProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return <DashboardContext.Provider value={{ sidebarOpen, setSidebarOpen }}>{children}</DashboardContext.Provider>
}

export const useDashboardContext = () => useContext(DashboardContext)
