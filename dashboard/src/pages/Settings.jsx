"use client"

import { useState } from "react"

function Settings() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Settings</h1>
      </div>

      <div className="flex border-b dark:border-gray-700">
        <button
          className={`px-4 py-2 ${
            activeTab === "account"
              ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-500 font-medium"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "api"
              ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-500 font-medium"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("api")}
        >
          API
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "notifications"
              ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-500 font-medium"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "billing"
              ? "border-b-2 border-teal-600 text-teal-600 dark:text-teal-500 font-medium"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("billing")}
        >
          Billing
        </button>
      </div>

      {activeTab === "account" && (
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Account Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your account details and preferences.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                id="name"
                defaultValue="John Doe"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                defaultValue="john.doe@example.com"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company (Optional)
              </label>
              <input
                id="company"
                defaultValue="Acme Inc."
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Other tabs would be implemented similarly */}
    </div>
  )
}

export default Settings
