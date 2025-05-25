"use client"

import { Bell, Menu, Moon, Search, Sun } from "lucide-react"
import { useDashboardContext } from "../contexts/DashboardContext"
import { useTheme } from "../contexts/ThemeContext"
import { useMobile } from "../hooks/useMobile"

function Header() {
  const { sidebarOpen, setSidebarOpen } = useDashboardContext()
  const isMobile = useMobile()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700 px-4 sm:px-6">
      {isMobile && (
        <button
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </button>
      )}

      <div className="relative flex-1 md:grow-0 md:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 md:w-80"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </button>
        <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </button>
      </div>
    </header>
  )
}

export default Header
