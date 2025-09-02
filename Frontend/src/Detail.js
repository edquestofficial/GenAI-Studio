import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const Detail = () => {
  const [agents, setAgents] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/knowledgelens/agents")
      .then((res) => res.json())
      .then((data) => {
        // backend may return [] or { agents: [...] }
        const list = Array.isArray(data) ? data : data?.agents || [];
        setAgents(list);
      })
      .catch((err) => console.error("Error fetching agents:", err));
  }, []);

  const handleCreateClick = () => {
    navigate("/create-agent");
  };

  const openChat = (name) => {
    navigate(`/chat/${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar stays intact here */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Create New Agent */}
          <div
            onClick={handleCreateClick}
            className="flex flex-col items-center justify-center bg-sky-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer p-10 h-64"
          >
            <div className="text-xl font-semibold text-gray-800 mb-4">
              Create your own AI Agent
            </div>
            <div className="text-6xl text-blue-500 font-bold">+</div>
          </div>

          {/* Existing Agents */}
          {agents.map((agent, idx) => (
            <div
              key={`${agent.agent_name}-${idx}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => openChat(agent.agent_name)}
              title="Open Chat"
            >
              <h3 className="text-lg font-bold text-gray-800">{agent.agent_name}</h3>
              <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                {agent.agent_persona}
              </p>
              {/* Delete Button */}
                <button
                  onClick={async (e) => {
                    e.stopPropagation(); // prevent card click
                    if (window.confirm(`Delete agent "${agent.agent_name}"?`)) {
                      try {
                        const res = await fetch(
                          `http://localhost:8000/knowledgelens/agents/${encodeURIComponent(agent.agent_name)}`,
                          { method: "DELETE" }
                        );
                        if (!res.ok) throw new Error("Delete failed");
                        // Remove from state to update UI
                        setAgents((prev) =>
                          prev.filter((a) => a.agent_name !== agent.agent_name)
                        );
                        alert("Agent deleted successfully!");
                      } catch (err) {
                        console.error(err);
                        alert("Failed to delete agent.");
                      }
                    }
                  }}
                  className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Detail;
