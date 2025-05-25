"use client"

import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import {virtualUrlService} from "../services/api"
function NewVirtualUrl() {
  const { id: collectionId } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          to={`/dashboard/collections/${collectionId}`}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Create New Virtual URL</h1>
      </div>

      <div className="max-w-2xl rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Virtual URL Details</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create a new virtual URL in this collection.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="path" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Virtual URL Path
            </label>
            <input
              id="path"
              placeholder="e.g., homepage-banner"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This will be the path used to access your asset: /v/homepage-banner
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (Optional)
            </label>
            <input
              id="description"
              placeholder="e.g., Main banner for the homepage"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload File
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 10MB)</p>
                </div>
                <input id="file-upload" type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Link
            to={`/dashboard/collections/${collectionId}`}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Link>
          <button onClick={virtualUrlService.createVirtualUrl} className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            Create Virtual URL
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewVirtualUrl
