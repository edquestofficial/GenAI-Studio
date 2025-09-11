import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Upload from "./Upload";
import Login from "./Login";
import RequireAuth from "./RequireAuth";
import useAuth from "./useAuth";
import Dashboard from "./Dashboard";
import "./App.css";
import AgentDetail from "./AgentDetail";

function App() {
  const { authed } = useAuth();

  return (
    <div className="App">
      {authed && <Navbar />}
      <div className="mt-2">
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          
          <Route path="/agents/:agent_name" element={<AgentDetail />} />
          <Route
            path="/upload"
            element={
              <RequireAuth>
                <Upload />
              </RequireAuth>
            }
          />
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
