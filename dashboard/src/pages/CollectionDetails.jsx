"use client"

import { useParams, Link } from "react-router-dom"
import { ArrowLeft, PlusCircle, Search } from "lucide-react"

function CollectionDetails() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          to="/dashboard/collections"
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Collection Name</h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Collection Details</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Collection description goes here</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Virtual URLs</div>
                <div className="text-2xl font-bold dark:text-white">12</div>
              </div>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage Used</div>
                <div className="text-2xl font-bold dark:text-white">1.2 GB</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Virtual URLs</h3>
          <Link
            to={`/dashboard/collections/${id}/virtual-urls/new`}
            className="inline-flex items-center px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Virtual URL
          </Link>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="search"
              placeholder="Search virtual URLs..."
              className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            Filter
          </button>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Virtual URLs will be displayed here</div>
      </div>
    </div>
  )
}

export default CollectionDetails
