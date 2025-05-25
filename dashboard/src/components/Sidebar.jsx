"use client"

import { Link, useLocation } from "react-router-dom"
import { useDashboardContext } from "../contexts/DashboardContext"
import { useMobile } from "../hooks/useMobile"
import { BarChart3, Cloud, Layers, LinkIcon, LogOut, Settings, User } from "lucide-react"

function Sidebar() {
  const location = useLocation()
  const isMobile = useMobile()
  const { sidebarOpen, setSidebarOpen } = useDashboardContext()

  const routes = [
    {
      label: "Dashboard",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      href: "/dashboard",
      active: location.pathname === "/dashboard",
    },
    {
      label: "Collections",
      icon: <Layers className="mr-2 h-4 w-4" />,
      href: "/dashboard/collections",
      active: location.pathname === "/dashboard/collections" || location.pathname.startsWith("/dashboard/collections/"),
    },
    {
      label: "Virtual URLs",
      icon: <LinkIcon className="mr-2 h-4 w-4" />,
      href: "/dashboard/virtual-urls",
      active:
        location.pathname === "/dashboard/virtual-urls" || location.pathname.startsWith("/dashboard/virtual-urls/"),
    },
    {
      label: "Cloud Storage",
      icon: <Cloud className="mr-2 h-4 w-4" />,
      href: "/dashboard/cloud-storage",
      active:
        location.pathname === "/dashboard/cloud-storage" || location.pathname.startsWith("/dashboard/cloud-storage/"),
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      href: "/dashboard/analytics",
      active: location.pathname === "/dashboard/analytics",
    },
    {
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      href: "/dashboard/settings",
      active: location.pathname === "/dashboard/settings",
    },
  ]

  if (isMobile && !sidebarOpen) {
    return null
  }

  const sidebarClasses = `
    flex h-screen flex-col border-r bg-white dark:bg-gray-800 dark:border-gray-700
    ${isMobile ? "fixed inset-y-0 left-0 z-50 w-64" : "w-64"}
  `

  return (
    <div className={sidebarClasses}>
      <div className="flex h-14 items-center border-b px-4 dark:border-gray-700">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Cloud className="h-6 w-6 text-teal-600 dark:text-teal-500" />
          <span className="dark:text-white">mycdn.site</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => {
            const buttonClasses = `
              flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md
              ${
                route.active
                  ? "bg-gray-100 dark:bg-gray-700 font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }
            `

            return (
              <Link key={route.href} to={route.href} className={buttonClasses}>
                {route.icon}
                {route.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4 dark:border-gray-700">
        <div className="flex items-center gap-2 rounded-lg p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 truncate">
            <div className="text-sm font-medium dark:text-white">John Doe</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">john.doe@example.com</div>
          </div>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
