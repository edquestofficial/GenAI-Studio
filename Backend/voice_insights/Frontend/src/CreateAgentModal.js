import React, {useState } from "react";
import "./CreateAgentModal.css";

function CreateAgentModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [persona, setPersona] = useState("");
  const [report, setReport] = useState("");
  // const [reportFormat, setReportFormat] = useState("");  // ✅ new state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !persona.trim() || !report.trim()) {
      setError("Agent name, persona, and report are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("agent_name", name);
      formData.append("agent_persona", persona);
      formData.append("agent_report", report);   // ✅ send new field

      const response = await fetch("http://localhost:8000/agents/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create agent");
      }

      const data = await response.json();

      // Pass created agent to parent
      onSave(data);

      // Reset form & close modal
      setName("");
      setPersona("");
      setReport("");  // ✅ reset
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-stitch-card">
        <h2 className="modal-title">Create Agent</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>Agent Name</label>
          <input
            type="text"
            placeholder="Enter agent name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Agent Persona</label>
          <textarea
            placeholder="Describe the agent’s role/persona..."
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
          />

          <label>Agent Report</label>
          <textarea
            type="text"
            placeholder="enter your desired format....."
            value={report}
            onChange={(e) => setReport(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              ✖ Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAgentModal;
