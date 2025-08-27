import React, { useState } from "react";
import Sidebar from "./Sidebar";

const MentalHealthSupport = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [isOpen, setIsOpen] = useState(true);

return (
    <div className="bg-gray-50 min-h-screen w-full">
        <div className="w-full bg-white rounded shadow-md flex gap-1">
            <div style={{ width: isOpen ? "25%" : "5%" }}>
                {!isOpen && (
                    <button
                        className="p-3 bg-blue-500 text-white rounded-md flex items-center justify-center"
                        onClick={() => setIsOpen(true)}
                        aria-label="Open Sidebar"
                    >
                        {/* Hamburger menu icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <rect x="4" y="6" width="16" height="2" rx="1" />
                            <rect x="4" y="11" width="16" height="2" rx="1" />
                            <rect x="4" y="16" width="16" height="2" rx="1" />
                        </svg>
                    </button>
                )}
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
            <div style={{ width: isOpen ? "75%" : "95%" }} className="relative">
                <div className="m-2 p-3 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Mental Health Support
                    </h1>
                    <div className="mt-4 flex space-x-2">
                        <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                            Assistant
                        </span>
                        <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                            AI
                        </span>
                        <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                            RAG
                        </span>
                    </div>
                </div>

                {/* Video/Image Placeholder */}
                <div className="m-2 p-3 flex justify-center items-center">
                    <div className="w-full h-64 bg-gray-100 rounded flex justify-center items-center">
                        <div className="space-y-2 text-gray-300 text-center">
                            <div className="h-6 w-48 bg-gray-200 rounded"></div>
                            <div className="h-4 w-36 bg-gray-200 rounded"></div>
                            <div className="h-4 w-40 bg-gray-200 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Live Badge */}
                <div className="absolute top-6 right-6">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        Live
                    </span>
                </div>

                {/* Tab Navigation */}
                <div className="m-2 p-3 border-t border-gray-200">
                    <div className="flex space-x-6">
                        <button
                            className={`px-4 py-2 text-sm font-medium ${
                                activeTab === "About"
                                    ? "border-b-2 border-blue-500 text-blue-600"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("About")}
                        >
                            About
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${
                                activeTab === "How to Use"
                                    ? "border-b-2 border-blue-500 text-blue-600"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("How to Use")}
                        >
                            How to Use
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${
                                activeTab === "Tech Stack"
                                    ? "border-b-2 border-blue-500 text-blue-600"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("Tech Stack")}
                        >
                            Tech Stack
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="m-2 p-3 bg-gray-50" style={{ marginLeft: "30px" }}>
                    {activeTab === "About" && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Project Overview
                            </h2>
                            <p className="text-gray-600 mt-4">
                                The Mental Health Support project is designed to provide
                                cutting-edge AI-powered mental wellness assistant, offering
                                personalized coping strategies. It leverages advanced AI
                                models to deliver highly accurate and efficient solutions,
                                transforming how users interact with assistant-driven systems.
                                Our goal is to create intuitive and powerful tools that
                                enhance productivity and user experience.
                            </p>
                            <h3 className="text-lg font-semibold text-gray-800 mt-6">
                                Key Features
                            </h3>
                            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
                                <li>Real-time processing for immediate results.</li>
                                <li>Seamless integration with existing workflows.</li>
                                <li>Scalable architecture to meet evolving demands.</li>
                                <li>Robust security measures to protect user data.</li>
                            </ul>
                        </div>
                    )}
                    {activeTab === "How to Use" && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                How to Use
                            </h2>
                            <p className="text-gray-600 mt-4">
                                Information on how to use the Mental Health Support
                                application will be available here.
                            </p>
                        </div>
                    )}
                    {activeTab === "Tech Stack" && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Tech Stack
                            </h2>
                            <p className="text-gray-600 mt-4">
                                Details about the project&apos;s technology stack will be
                                available here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);
};

export default MentalHealthSupport;
