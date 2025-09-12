import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateAgentModal from "./CreateAgentModal";
import "./Dashboard.css";

function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch("http://localhost:8000/agents");
      const data = await res.json();

      const agentsList = data.agents || []; // ✅ safe fallback

      const normalized = agentsList.map((agent) => ({
        id: agent.agent_name,
        agent_name: agent.agent_name,
        agent_persona: agent.agent_persona,
        agent_report : agent.agent_report,
      }));
      setAgents(normalized);
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  const handleSaveAgent = async (newAgent) => {
    const formattedAgent = {
      agent_name: newAgent.agent_name || newAgent.name,
      agent_persona: newAgent.agent_persona || newAgent.persona,
    };

    try {
      // ✅ save agent to backend
      await fetch("http://localhost:8000/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedAgent),
      });

      setAgents((prev) => [...prev, formattedAgent]);
    } catch (err) {
      console.error("Error saving agent:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="main-content">
        <div className="agents-grid">
          {/* Create Agent card */}
          <div
            className="create-agent-card"
            onClick={() => setShowModal(true)}
          >
            <h3>Create your own AI Agent</h3>
            <div className="plus">+</div>
          </div>

          {/* Render all agents */}
          {agents.map((agent) => (
            <div key={agent.id} className="agent-card">
              <div className="agent-avatar">🤖</div>
              <h4 className="agent-name">{agent.agent_name}</h4>
              <p className="agent-persona">{agent.agent_persona}</p>
              <button
                className="view-agent-btn"
                onClick={() =>
                  navigate(`/agents/${agent.agent_name}`, { state: { agent } })
                }
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <CreateAgentModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveAgent}
        />
      )}
    </div>
  );
}

export default Dashboard;

