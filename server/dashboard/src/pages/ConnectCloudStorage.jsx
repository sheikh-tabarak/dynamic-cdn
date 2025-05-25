import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

function ConnectCloudStorage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          to="/dashboard/cloud-storage"
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Connect Cloud Storage</h1>
      </div>

      <div className="max-w-2xl rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Connect a Cloud Storage Provider</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Link your cloud storage account to use with your virtual URLs.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex border-b dark:border-gray-700">
            <button className="px-4 py-2 border-b-2 border-teal-600 text-teal-600 dark:text-teal-500 font-medium">
              AWS S3
            </button>
            <button className="px-4 py-2 text-gray-500 dark:text-gray-400">Google Cloud</button>
            <button className="px-4 py-2 text-gray-500 dark:text-gray-400">Azure</button>
            <button className="px-4 py-2 text-gray-500 dark:text-gray-400">Dropbox</button>
          </div>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="aws-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Connection Name
              </label>
              <input
                id="aws-name"
                placeholder="e.g., My AWS S3"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="aws-access-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Access Key ID
              </label>
              <input
                id="aws-access-key"
                placeholder="Enter your AWS Access Key ID"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="aws-secret-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Secret Access Key
              </label>
              <input
                id="aws-secret-key"
                type="password"
                placeholder="Enter your AWS Secret Access Key"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="aws-region" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Region
              </label>
              <input
                id="aws-region"
                placeholder="e.g., us-east-1"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="aws-bucket" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bucket Name
              </label>
              <input
                id="aws-bucket"
                placeholder="Enter your S3 bucket name"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Link
            to="/dashboard/cloud-storage"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Link>
          <button className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            Connect Storage
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConnectCloudStorage
