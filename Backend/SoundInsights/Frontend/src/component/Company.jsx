// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Company = () => {
//   const navigate = useNavigate();
//   const [companies, setCompanies] = useState([]);

//   // Add or update company
//   const handleCreateCompany = (companyName, persona) => {
//     const existingCompany = companies.find(
//       (c) => c.name.toLowerCase() === companyName.toLowerCase()
//     );

//     if (existingCompany) {
//       // If company already exists, just open its SoundScript UI
//       navigate("/sound-script", { state: { company: existingCompany } });
//     } else {
//       // Add a new company card
//       const newCompany = {
//         id: Date.now(),
//         name: companyName,
//         persona,
//         audioFiles: [],
//       };
//       setCompanies((prev) => [...prev, newCompany]);
//       navigate("/sound-script", { state: { company: newCompany } });
//     }
//   };

//   const handleViewDocs = (company) => {
//     navigate("/company-documents", { state: { company } });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-semibold text-gray-800 mb-6">
//         Company Dashboard
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//         {/* Create New Card */}
//         <div
//           className="flex flex-col justify-center items-center p-6 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer"
//           onClick={() => {
//             const companyName = prompt("Enter Company Name:");
//             const persona = prompt("Enter Persona:");
//             if (companyName) {
//               handleCreateCompany(companyName.trim(), persona || "Default");
//             }
//           }}
//         >
//           <span className="text-4xl text-blue-500">+</span>
//           <p className="mt-2 text-gray-600">Create Company</p>
//         </div>

//         {/* Render all companies */}
//         {companies.map((company) => (
//           <div
//             key={company.id}
//             className="p-6 bg-white rounded-xl shadow hover:shadow-lg flex flex-col justify-between"
//           >
//             <div>
//               <h2 className="text-xl font-bold text-gray-800">{company.name}</h2>
//               <p className="text-gray-500">Persona: {company.persona}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 Files: {company.audioFiles.length}
//               </p>
//             </div>
//             <div className="mt-4 flex justify-between">
//               <button
//                 onClick={() =>
//                   navigate("/sound-script", { state: { company } })
//                 }
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//               >
//                 Open
//               </button>
//               <button
//                 onClick={() => handleViewDocs(company)}
//                 className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg"
//               >
//                 View Documents
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Company


