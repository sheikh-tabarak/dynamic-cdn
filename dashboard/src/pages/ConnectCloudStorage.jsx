// ConnectCloudStoragePage.js
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Button } from "@headlessui/react"; // You can create a custom button component if needed
import { Link } from "react-router-dom"; // Adjust based on your routing library
import { ArrowLeft } from "lucide-react";
import { cloudStorageService } from "../services/api"; // Adjust the import path as necessary
import { useEffect } from "react";
import ComingSoon from "../components/ComingSoon";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ConnectCloudStoragePage() {

  const Tabs = ["aws", "gcp", "azure", "dropbox", "cloudinary"]
  const [selectedTab, setSelectedTab] = useState("cloudinary");
  const [connectionData, setConnectionData] = useState({
    name: "",
    provider: "",
    credentials: {
      cloudName: "",
      apiKey: "",
      apiSecret: "",
      accessKey: "",
      secretKey: "",
      projectId: "",
      bucket: "",
    },
  });

  useEffect(() => {
    console.log(selectedTab)
  }, [selectedTab])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConnectionData((prev) => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cloudStorageService.createConnection({
        name: connectionData.name,
        provider: selectedTab,
        credentials: connectionData.credentials,
      });
      // Handle successful connection creation (e.g., redirect or show a success message)
      console.log("Connection created successfully");
    } catch (error) {

      console.error("Error creating connection:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/dashboard/cloud-storage">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Connect Cloud Storage</h1>
      </div>

      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold">Connect a Cloud Storage Provider</h2>
        <p className="text-sm text-gray-500 pb-4">Link your cloud storage account to use with your virtual URLs.</p>

        <Tab.Group defaultIndex={4} onChange={(index) => setSelectedTab(Tabs[index])}>
          <Tab.List className="flex space-x-1 rounded bg-gray-200 p-1">
            {Tabs.map((provider) => (
              <Tab
                // onClick={()=>setSelectedTab(provider)}
                key={provider}
                className={({ selected }) =>
                  classNames(
                    "w-full py-2.5 text-sm font-medium text-gray-700 rounded",
                    "focus:outline-none rounded",
                    selected ? "bg-white shadow " : "text-gray-500 hover:bg-gray-300"
                  )
                }
              >
                {provider === "aws" ? "AWS S3" : provider === "gcp" ? "Google Cloud" : provider === "azure" ? "Azure" : provider === "dropbox" ? "Dropbox" : provider === "cloudinary" ? "Cloudinary" : ""}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-4">
            {/* AWS S3 Tab */}
            <Tab.Panel value="aws" className="space-y-4">
              {/* <div className="space-y-2">
                <label htmlFor="aws-name" className="block text-sm font-medium text-gray-700">Connection Name</label>
                <input id="aws-name" placeholder="e.g., My AWS S3" className="block w-full p-2 border border-gray-300 rounded-md" onChange={(e) => setConnectionData({ ...connectionData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="aws-access-key" className="block text-sm font-medium text-gray-700">Access Key ID</label>
                <input id="aws-access-key" placeholder="Enter your AWS Access Key ID" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="accessKey" />
              </div>
              <div className="space-y-2">
                <label htmlFor="aws-secret-key" className="block text-sm font-medium text-gray-700">Secret Access Key</label>
                <input id="aws-secret-key" type="password" placeholder="Enter your AWS Secret Access Key" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="secretKey" />
              </div>
              <div className="space-y-2">
                <label htmlFor="aws-region" className="block text-sm font-medium text-gray-700">Region</label>
                <input id="aws-region" placeholder="e.g., us-east-1" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="region" />
              </div>
              <div className="space-y-2">
                <label htmlFor="aws-bucket" className="block text-sm font-medium text-gray-700">Bucket Name</label>
                <input id="aws-bucket" placeholder="Enter your S3 bucket name" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="bucket" />
              </div> */}

              <ComingSoon/>
            </Tab.Panel>

            {/* Google Cloud Tab */}
            <Tab.Panel value="gcp" className="space-y-4">
              {/* <div className="space-y-2">
                <label htmlFor="gcp-name" className="block text-sm font-medium text-gray-700">Connection Name</label>
                <input id="gcp-name" placeholder="e.g., My Google Cloud Storage" className="block w-full p-2 border border-gray-300 rounded-md" onChange={(e) => setConnectionData({ ...connectionData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="gcp-project" className="block text-sm font-medium text-gray-700">Project ID</label>
                <input id="gcp-project" placeholder="Enter your GCP Project ID" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="projectId" />
              </div>
              <div className="space-y-2">
                <label htmlFor="gcp-key" className="block text-sm font-medium text-gray-700">Service Account Key</label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="gcp-key-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-3 text-gray-500"
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
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JSON key file</p>
                    </div>
                    <input id="gcp-key-upload" type="file" className="hidden" />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="gcp-bucket" className="block text-sm font-medium text-gray-700">Bucket Name</label>
                <input id="gcp-bucket" placeholder="Enter your GCS bucket name" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="bucket" />
              </div> */}

              <ComingSoon/>
            </Tab.Panel>

            {/* Azure Tab */}
            <Tab.Panel value="azure" className="space-y-4">
           <ComingSoon/>
              {/* <div className="space-y-2">
                <label htmlFor="azure-name" className="block text-sm font-medium text-gray-700">Connection Name</label>
                <input id="azure-name" placeholder="e.g., My Azure Blob Storage" className="block w-full p-2 border border-gray-300 rounded-md" onChange={(e) => setConnectionData({ ...connectionData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="azure-account" className="block text-sm font-medium text-gray-700">Storage Account Name</label>
                <input id="azure-account" placeholder="Enter your Azure Storage Account name" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="account" />
              </div>
              <div className="space-y-2">
                <label htmlFor="azure-key" className="block text-sm font-medium text-gray-700">Access Key</label>
                <input id="azure-key" type="password" placeholder="Enter your Azure Storage Access Key" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="key" />
              </div>
              <div className="space-y-2">
                <label htmlFor="azure-container" className="block text-sm font-medium text-gray-700">Container Name</label>
                <input id="azure-container" placeholder="Enter your Azure Storage Container name" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="container" />
              </div> */}
            </Tab.Panel>

            {/* Dropbox Tab */}
            <Tab.Panel value="dropbox" className="space-y-4">
              {/* <div className="space-y-2">
                <label htmlFor="dropbox-name" className="block text-sm font-medium text-gray-700">Connection Name</label>
                <input id="dropbox-name" placeholder="e.g., My Dropbox" className="block w-full p-2 border border-gray-300 rounded-md" onChange={(e) => setConnectionData({ ...connectionData, name: e.target.value })} />
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <p className="text-center text-gray-500">
                  Connect to your Dropbox account by clicking the button below.
                </p>
                <Button className="bg-teal-600 text-white rounded-md px-4 py-2 hover:bg-teal-700">Connect to Dropbox</Button>
              </div> */}

              <ComingSoon/>
            </Tab.Panel>

            {/* Cloudinary Tab */}
            <Tab.Panel value="cloudinary" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cloudinary-name" className="block text-sm font-medium text-gray-700">Connection Name</label>
                <input id="cloudinary-name" placeholder="e.g., My Cloudinary Connection" className="block w-full p-2 border border-gray-300 rounded-md" onChange={(e) => setConnectionData({ ...connectionData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="cloudinary-cloud-name" className="block text-sm font-medium text-gray-700">Cloud Name</label>
                <input id="cloudinary-cloud-name" placeholder="Enter your Cloudinary Cloud Name" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="cloudName" />
              </div>
              <div className="space-y-2">
                <label htmlFor="cloudinary-api-key" className="block text-sm font-medium text-gray-700">API Key</label>
                <input id="cloudinary-api-key" placeholder="Enter your Cloudinary API Key" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="apiKey" />
              </div>
              <div className="space-y-2">
                <label htmlFor="cloudinary-api-secret" className="block text-sm font-medium text-gray-700">API Secret</label>
                <input id="cloudinary-api-secret" type="password" placeholder="Enter your Cloudinary API Secret" className="block w-full p-2 border border-gray-300 rounded-md" onChange={handleInputChange} name="apiSecret" />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="flex justify-between mt-6">
          <Button variant="outline" asChild>
            <Link to="/dashboard/cloud-storage"> Cancel</Link>
          </Button>
          <Button className="bg-teal-600 text-white rounded-md px-4 py-2 hover:bg-teal-700" onClick={handleSubmit}>Connect Storage</Button>
        </div>
      </div>
    </div>
  );
}