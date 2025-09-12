import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./AgentDetail.css";

function AgentDetail() {
  const { agent_name } = useParams(); // from URL
  const location = useLocation();
  const navigate = useNavigate();

  const agentFromState = location.state?.agent;

  const [agentData, setAgentData] = useState(agentFromState || null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  console.log(agent_name)
  // Fetch agent if not in location.state
  useEffect(() => {
    if (!agentFromState && agent_name) {
      console.log("we are in agent details.");
      fetch(`http://localhost:8000/agents/${agent_name}`)
        .then((res) => res.json())
        .then((data) => setAgentData(data))
        .catch((err) => console.error("Failed to fetch agent:", err));
    }
  }, [agentFromState, agent_name]);

  // Fetch transcriptions
  useEffect(() => {
    if (!agent_name) return;
    const fetchTranscriptions = async () => {
      try {
        console.log("2nd use effect colled")
        const response = await fetch(
          `http://localhost:8000/agents/${agent_name}/transcriptions`
        );
        if (!response.ok) {
          const errData = await response.json();
          console.warn(errData.error);
          return;
        }
        const data = await response.json();
        
        console.log(data)
        setTranscriptions(data|| []);
      } catch (error) {
        console.error("Error fetching transcriptions:", error);
      }
    };
    fetchTranscriptions();
  }, [agent_name]);

  if (!agentData) return null;

  return (
    <div className="agent-detail">
      {/* Navbar */}
      <header className="agent-navbar">
        <h2 className="logo">AgentManager</h2>
        <nav className="nav-links">
          <span onClick={() => navigate("/")}>Agents</span>
          <span className="active">Transcriptions</span>
        </nav>
      </header>

      {/* Header Section */}
      <div className="agent-header">
        <h1>{agent_name || "Unknown Agent"}</h1>
        <p className="persona">{agentData.agent_persona || ""}</p>
        <button
          className="add-btn"
          onClick={() =>
            navigate(`/upload`, { state: { agent: agentData } })
          }
        >
          + Add New
        </button>
      </div>

      {/* List View */}
      {selectedIndex === null ? (
        <div className="list-view">
          {transcriptions.length === 0 ? (
            <p>No transcriptions yet. Add one!</p>
          ) : (
            <table className="transcription-table">
              <thead>
                <tr>
                  <th>Transcription</th>
                  <th>Summary</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transcriptions.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {item.transcription
                        ? item.transcription.split(" ").slice(0, 10).join(" ") +
                          "..."
                        : "No transcription"}
                    </td>
                    <td>
                      {console.log(item)}
                      {item.summary ?item.summary.summary.split(" ").slice(0, 10).join(" ") +"..."
                        : "No summary"}
                    </td>
                    <td>
                      <button onClick={() => setSelectedIndex(index)}>
                        View ➜
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* Detail View */
        <div className="detail-view">
          <button className="back-btn" onClick={() => setSelectedIndex(null)}>
            ← Back
          </button>

          {transcriptions[selectedIndex] && (
            <div className="audio-card">
              <h3>
                {transcriptions[selectedIndex].title ||
                  `Recording ${selectedIndex + 1}`}
              </h3>

              {transcriptions[selectedIndex].audio_path && (
                <audio controls className="audio-player">
                  <source
                    src={`http://localhost:8000/${transcriptions[selectedIndex].audio_path}`}
                    type="audio/mp3"
                  />
                  Your browser does not support the audio element.
                </audio>
              )}

              <div className="section">
                <h4>Transcription</h4>
                <p className="transcription-text">
                  {transcriptions[selectedIndex].transcription ||
                    "No transcription available"}
                </p>
              </div>

              {transcriptions[selectedIndex].summary && (
                <>
                  <h4>Summary:</h4>
                  <pre className="summary-box">
                    {transcriptions[selectedIndex].summary.summary}
                  </pre>

                  <div className="structured-summary">
                    <h4>Details</h4>
                    {Object.entries(transcriptions[selectedIndex].summary)
                      .filter(([key]) => key !== "summary")
                      .map(([key, value]) => (
                        <p key={key}>
                          <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                          {typeof value === "object"
                            ? JSON.stringify(value, null, 2)
                            : value}
                        </p>
                      ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AgentDetail;
