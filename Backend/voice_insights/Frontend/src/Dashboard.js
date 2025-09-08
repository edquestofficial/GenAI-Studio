import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  fetch("http://localhost:8000/companies")
    .then((res) => res.json())   // return JSON here
    .then((data) => {
      console.log(data);         // log actual data
      setProjects(data);         // update state
    })
    .catch((err) => console.error(err));
}, []);

  const handleCreate = () => {
    navigate("upload"); // go to SoundScript Upload UI
  };

  return (
    <div className="dashboard">
      <h1>Your Transcriptions</h1>
      <div className="card-container">
        <div className="card create-card" onClick={handleCreate}>
          <h3>Transcribe your audio</h3>
          <span className="plus">+</span>
        </div>
        {projects.map((p, index) => (
          <div key={index} className="card">
            <h3>{p.company_name}</h3>
            {p.audioFiles && p.audioFiles.length > 0 ? (
                <ul className="file-list">
            {p.audioFiles.map((file, idx) => (
                <li key={idx}>
                <a
                href={`http://localhost:8000/${file.replace(/\\/g, "/")}`}
                target="_blank"
                rel="noreferrer"
                >
                {`File ${idx + 1}`}
                </a>
                </li>
            ))}
                </ul>
            ) : (
                <p>No files uploaded</p>
            )}
            </div>
        ))}
        
      </div>
    </div>
  );
}

export default Dashboard;
