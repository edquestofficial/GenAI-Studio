import React from "react";
import { Link } from "react-router-dom";

const Box = ({ name, src, description, url }) => {
  const dataToPass = { name, src, description, url };
  return (
    <Link to="/detail" state={dataToPass}>
      <div
        className="w-80 h-[350px] max-w-sm mx-auto border-2 border-blue-100 rounded-lg shadow-lg m-4"
        style={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="flex flex-col items-center h-full">
          <div className="flex items-center justify-center w-full h-1/2">
            <img
              src={src}
              alt={name}
              className="w-24 max-h-full object-contain"
            />
          </div>
          <div className="p-6 bg-blue-100 h-1/2 w-full flex flex-col justify-between">
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <div className="flex space-x-2 mt-3 justify-center">
              <span className="px-3 py-1 bg-gray-200 text-sm rounded-xl">
                Assistant
              </span>
              <span className="px-3 py-1 bg-gray-200 text-sm rounded-xl">
                AI
              </span>
              <span className="px-3 py-1 bg-gray-200 text-sm rounded-xl">
                RAG
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Box;
