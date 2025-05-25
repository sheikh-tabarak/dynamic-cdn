import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { collectionService } from "../services/api" // Import the API service
import { useState } from "react";

function NewCollection() {

  const [collectionData, setCollectionData] = useState({
    name: "",
    description: "",
    pathPrefix: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await collectionService.createCollection({
        name: collectionData.name,
        description: collectionData.description,
        pathPrefix: collectionData.pathPrefix,
      });

      // Handle successful connection creation (e.g., redirect or show a success message)
      console.log("collection created successfully");
    } catch (error) {

      console.error("Error creating connection:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCollectionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          to="/dashboard/collections"
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Create New Collection</h1>
      </div>

      <div className="max-w-2xl rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Collection Details</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a new collection to organize your virtual URLs and assets.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Collection Name
            </label>
            <input
              id="name"
              name="name"
              onChange={handleInputChange}
              placeholder="e.g., Website Assets"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              onChange={handleInputChange}
              id="description"
              name="description"
              placeholder="Describe the purpose of this collection..."
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="path-prefix" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Path Prefix (Optional)
            </label>
            <input
              id="pathPrefix"
              name="pathPrefix"
              onChange={handleInputChange}
              placeholder="e.g., website/"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A prefix that will be added to all virtual URLs in this collection.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Link
            to="/dashboard/collections"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Link>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            Create Collection
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewCollection
