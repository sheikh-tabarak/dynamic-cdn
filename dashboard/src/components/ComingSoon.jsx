import { InfoIcon } from "lucide-react";
import React from "react";

export default function ComingSoon() {
    return (
        // <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 p-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-12 text-center w-full">
        {/* // <div className="flex flex-col justify-center items-center "> */}
            <div className="flex justify-center">
                <InfoIcon className="w-20 h-20 text-teal-500 animate-pulse" />
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white my-6">Coming Soon</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                This feature is under construction and will be available shortly.
            </p>

        {/* // </div> */}
          </div>
        // </div>
    );
}

