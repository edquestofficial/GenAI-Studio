import { Routes, Route } from "react-router-dom";
import CreateAgentForm from "./form";
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";
import CreateAgentCard from "./Detail";
import ChatPage from "./ChatPage";

function App() {
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
      }}
    >
      <Header />

      <div
        className="flex w-full"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <div className="w-100%">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail" element={<CreateAgentCard />} />
            <Route path="/create-agent" element={<CreateAgentForm />} />
            <Route path="/create-agent-card" element={<CreateAgentCard />} />
            <Route path="/chat/:agentName" element={<ChatPage />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
