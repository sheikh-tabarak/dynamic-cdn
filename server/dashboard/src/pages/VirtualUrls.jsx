import { Link } from "react-router-dom"
import { PlusCircle, Search } from "lucide-react"

function VirtualUrls() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Virtual URLs</h1>
        <Link
          to="/dashboard/virtual-urls/new"
          className="inline-flex items-center px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Virtual URL
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Manage Virtual URLs</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and manage all your virtual URLs across collections.
          </p>
        </div>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="search"
              placeholder="Search virtual URLs..."
              className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="all">All Collections</option>
              <option value="website">Website Assets</option>
              <option value="marketing">Marketing Campaign</option>
              <option value="products">Product Images</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
              Filter
            </button>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Virtual URLs will be displayed here</div>
      </div>
    </div>
  )
}

export default VirtualUrls
