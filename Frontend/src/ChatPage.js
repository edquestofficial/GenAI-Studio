import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const ChatPage = () => {
  const { agentName } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [persona, setPersona] = useState("");

  // Load persona (from navigation state OR backend)
  useEffect(() => {
    if (location.state?.agentPersona) {
      setPersona(location.state.agentPersona);
    } else {
      fetch("http://localhost:8000/knowledgelens/agents")
        .then((res) => res.json())
        .then((data) => {
          const agents = Array.isArray(data) ? data : data.agents;
          if (agents) {
            const agent = agents.find(
              (a) => a.agent_name?.toLowerCase() === agentName?.toLowerCase()
            );
            if (agent) setPersona(agent.agent_persona);
          }
        })
        .catch((err) => console.error("Failed to fetch agents:", err));
    }
  }, [agentName, location.state]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message locally
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`http://localhost:8000/knowledgelens/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_name: agentName,
          agent_persona: persona,
          user_message: input,
        }),
      });

      const data = await res.json();
      const botMsg = {
        role: "assistant",
        content: data.answer || "⚠️ No response",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error contacting backend." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-[600px] w-[800px] mx-auto my-8 border rounded shadow-lg">
      <h2 className="p-4 bg-gray-200 text-lg font-bold rounded-t">
        Chat with {agentName}
      </h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 flex border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
