import { Link } from "react-router-dom"
import { PlusCircle } from "lucide-react"
import { CloudStorageTable } from "../components/CloudStorageTable"

function CloudStorage() {
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Cloud Storage</h1>
        <Link
          to="/dashboard/cloud-storage/connect"
          className="inline-flex items-center px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Connect Storage
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Connected Storage Providers</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your connected cloud storage providers.</p>

          <CloudStorageTable />
        </div>
        {/* <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Connected storage providers will be displayed here
        </div> */}
      </div>
    </div>
  )
}

export default CloudStorage
