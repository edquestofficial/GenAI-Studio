import React from "react";

const Sidebar = ({ isOpen, setIsOpen }) => {
return (
	<div
		className={`bg-white shadow-lg transform ${
			isOpen ? "translate-x-0" : "-translate-x-full"
		} transition-transform duration-300 ease-in-out`}
		style={{ width: "300px", height: "100%" }}
	>
		{/* Header */}
		<div className="flex justify-between items-center p-4 border-b">
			<h2 className="text-lg font-bold">All Projects</h2>
			<button
				className="text-gray-500 hover:text-gray-700"
				onClick={() => setIsOpen(false)}
			>
				✖
			</button>
		</div>

		{/* Content */}
		<div className="p-4 space-y-3">
			<button className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
				Mental Health Support
				<span className="text-blue-500">💙</span>
			</button>
			<button className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
				Hotel Booking Assistant
				<span className="text-green-500">🏨</span>
			</button>
			<button className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
				Invoice Extractor
				<span className="text-blue-500">📄</span>
			</button>
			<button className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
				SoundScript
				<span className="text-green-500">🎵</span>
			</button>
			<button className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
				Eyeglass Try-On
				<span className="text-blue-500">👓</span>
			</button>
			<button className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
				AI Tutor
				<span className="text-green-500">🤖</span>
			</button>
			<button className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
				Code Review Assistant
				<span className="text-blue-500">💻</span>
			</button>
		</div>

		{/* Footer Links */}
		<div className="px-4 pb-8">
			<button
				className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
				onClick={() => setIsOpen(false)}
			>
				<img
					src="https://img.icons8.com/ios-filled/24/000000/back.png"
					alt="Back"
					className="w-5 h-5"
				/>
				<span>Back to Home</span>
			</button>
			<button className="mt-4 w-full text-left text-sm text-gray-600 hover:text-gray-800">
				Contact Us
			</button>
			<button className="mt-2 w-full text-left text-sm text-gray-600 hover:text-gray-800">
				About Us
			</button>
		</div>
	</div>
);
};

export default Sidebar;
