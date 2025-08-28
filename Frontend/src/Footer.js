import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white-100 py-4 px-8 flex justify-between items-center border-t border-gray-300">
      {/* Navigation Links */}
      <div className="flex space-x-4">
        <a href="/" className="text-gray-700 hover:text-gray-900 font-bold">
          Home
        </a>
        <a href="/blog" className="text-gray-700 hover:text-gray-900 font-bold">
          Blog
        </a>
      </div>

      {/* Social Icons */}
      <div className="flex space-x-4">
        <a href="https://github.com/edquestofficial" target="_blank" rel="noopener noreferrer">
          <img
            src="github.png" // Replace with your GitHub icon URL or SVG
            alt="GitHub"
            className="w-6 h-6"
          />
        </a>
        <a href="https://x.com/edquestofficial" target="_blank" rel="noopener noreferrer">
          <img
            src="twitter.png" // Replace with your Twitter icon URL or SVG
            alt="Twitter"
            className="w-6 h-6"
          />
        </a>
        <a
          href="https://www.linkedin.com/company/edquestofficial"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="linkedin.png" // Replace with your LinkedIn icon URL or SVG
            alt="LinkedIn"
            className="w-6 h-6"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
