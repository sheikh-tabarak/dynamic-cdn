"use client"

import { useState } from "react"

function Analytics() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Requests</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-gray-500 dark:text-gray-400"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold dark:text-white">45,231</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+20.1% from last month</p>
          </div>
        </div>

        {/* More analytics cards would go here */}
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Request Overview</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Number of requests over time</p>
        </div>
        <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
          Chart will be displayed here
        </div>
      </div>
    </div>
  )
}

export default Analytics
