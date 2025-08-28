import React from "react";
import { Link } from "react-router-dom";

function Header() {
return (
	<header className="flex justify-between items-center p-4 shadow-md bg-white">
		{/* Logo Section */}
		<div className="flex items-center space-x-2">
			<img 
					src="edquest.png" 
					alt="Edquest Logo" 
					className="h-15 w-12 object-contain" 
  />
			<h1 className="text-blue-500 text-xl font-bold italic">Edquest</h1>
		</div>

		{/* Navigation Links */}
		{/* <nav className="flex space-x-6 text-gray-700">
			<Link to="/">Home</Link>
			<Link to="/">Projects</Link>
			<Link to="/">About</Link>
		</nav> */}

		<nav className="flex space-x-6 text-gray-700 font-bold">
		<Link to="/" className="hover:underline">Home</Link>
		<Link to="/" className="hover:underline">Projects</Link>
		<Link to="/" className="hover:underline">About</Link>
		</nav>


		{/* Search and Profile Section */}
		<div className="flex items-center space-x-4">
			{/* Search Bar */}
			<div className="relative">
				<input
					type="text"
					className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
					placeholder="Search projects..."
				/>
				<div className="absolute left-2 top-2.5 text-gray-500">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M9 3a6 6 0 100 12 6 6 0 000-12zm-9 6a9 9 0 1118 0 9 9 0 01-18 0zm13 0a4 4 0 10-2.734 3.674l2.596 2.596a1 1 0 101.415-1.415l-2.596-2.596A3.996 3.996 0 0013 9z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			</div>

			{/* Notification Icon */}
			<div className="text-gray-500 cursor-pointer">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d="M19 14v-5c0-3.1-1.64-5.64-4.5-6.32V2.5c0-.83-.67-1.5-1.5-1.5S11.5 1.67 11.5 2.5v.18C8.64 3.36 7 5.9 7 9v5l-2 2v1h16v-1l-2-2zm-5.5 7c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" />
				</svg>
			</div>

			{/* Profile Avatar */}
			<div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300">
				<img
					src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=150&h=150&facepad=2"
					alt="Profile Avatar"
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	</header>
);
}

export default Header;