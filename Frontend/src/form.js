import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAgentForm = () => {
  const [agentName, setAgentName] = useState("");
  const [agentPersona, setAgentPersona] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");



    if (!agentName.trim() || !agentPersona.trim() || !documentFile) {
      setError("All fields are required.");
      return;
    }
    setSubmitting(true);

    try {
      // call your backend save endpoint
      const formData = new FormData();
      formData.append("agent_name", agentName);
      formData.append("agent_persona", agentPersona);
      formData.append("document", documentFile); 

      const res = await fetch("http://localhost:8000/knowledgelens/saves_agents", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Failed to create agent");
    }

    const data = await res.json();
    console.log("Agent created:", data);

    setSuccess("Agent created successfully!");


      // 🚀 redirect to chat and carry persona
      console.log(res)
      navigate(`/chat/${agentName}`, { state: { agentPersona } });

    } catch (err) {
      console.error("Error creating agent:", err);
      setError("Agent already exists or something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="p-6 w-full max-w-md bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Create New Agent</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}


      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Agent Name"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Agent Persona"
          value={agentPersona}
          onChange={(e) => setAgentPersona(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />

        <input
          type="file"
          onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
          accept=".pdf,.txt,.md,.doc,.docx"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create Agent"}
        </button>
      </form>
    </div>
  </div>
);

};

export default CreateAgentForm;