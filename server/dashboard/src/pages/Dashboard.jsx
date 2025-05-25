import { Link } from "react-router-dom"
import { PlusCircle } from "lucide-react"

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Dashboard</h1>
        <Link
          to="/dashboard/collections/new"
          className="inline-flex items-center px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Collection
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Collections</h3>
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
            <div className="text-2xl font-bold dark:text-white">8</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+2 from last month</p>
          </div>
        </div>

        {/* More dashboard cards would go here */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Request Overview</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Asset requests over the last 30 days</p>
          </div>
          <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chart will be displayed here
          </div>
        </div>

        {/* More dashboard sections would go here */}
      </div>
    </div>
  )
}

export default Dashboard
