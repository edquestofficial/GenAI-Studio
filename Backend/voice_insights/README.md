##### Voice Insights ###############

This project is an end-to-end solution for analyzing audio calls. It allows users to upload recordings, transcribe speech, generate structured summaries, and view AI-powered analytics for each agent.

The system is built with a FastAPI backend and a React frontend, making it modular, scalable, and easy to extend.



#### 📂 Project Structure ######################################################

voice_insights/
│
│── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── routes/                  # API endpoints (transcription, summary, agents)
│   ├── services/                # Business logic (transcription, summaries, storage)
│   ├── agents/                  # Agent-specific JSON data storage
│   ├── pyproject.toml           # Backend dependencies (managed with Poetry/PDM)
│   └── README.md                # Backend-specific documentation
│
│── frontend/
│   ├── src/
│   │   ├── AgentDetail.css       # Styles for AgentDetail component
│   │   ├── AgentDetail.js        # Displays details of an agent & transcriptions
│   │   ├── App.css               # Global styles for the React app
│   │   ├── App.js                # Main React app, handles routing
│   │   ├── CreateAgentModal.css  # Styles for CreateAgentModal
│   │   ├── CreateAgentModal.js   # Modal for creating a new agent
│   │   ├── createContext.js      # React Context for global state management
│   │   ├── dashboard-graph.jpeg  # Static image used in dashboard UI
│   │   ├── Dashboard.css         # Styles for Dashboard component
│   │   ├── Dashboard.js          # Dashboard view showing analytics & agents
│   │   ├── FullAnalyticsData.css # Styles for FullAnalyticsData component
│   │   ├── FullAnalyticsData.jsx # Structured analytics view for transcriptions
│   │   ├── index.css             # Base styles applied globally
│   │   ├── index.js              # React entry point (renders <App/>)
│   │   ├── Login.css             # Styles for Login page
│   │   ├── Login.js              # Login page for authentication
│   │   ├── logo.svg              # App logo asset
│   │   ├── Navbar.css            # Styles for Navbar component
│   │   ├── Navbar.js             # Top navigation bar
│   │   ├── RequireAuth.js        # Route protection wrapper for private pages
│   │   ├── Upload.css            # Styles for Upload component
│   │   ├── Upload.js             # Upload page for audio files (transcription flow)
│   │   ├── useAuth.js            # Custom React hook for handling authentication
│   └── package.json              # Frontend dependencies & scripts
│
│── README.md                     # Project documentation (root)


## Features

1. Audio Upload & Transcription – Upload call recordings and generate accurate transcriptions.

2.  AI-Powered Summarization – Extract structured summaries and key insights from calls.

3. Full Analytics View – Sentiment analysis, professionalism rating, and structured call breakdown.

4. Agent Management – Maintain separate histories of calls for each agent.

5. Full-Stack Architecture – Seamless integration between backend and frontend.


###### ⚙️ Tech Stack #############

* Backend: FastAPI (Python)

Frontend: React.js

Storage: JSON-based persistence for agent data

AI/LLM: Integrated with summarization & analysis logic

Deployment: Local run with future support for Docker

#####  Getting Started
1. Start the Backend

Navigate to the backend folder.

Install dependencies (Python + FastAPI + required libraries).

Run the FastAPI server.

The backend will be available at: http://localhost:8000

2. Start the Frontend

Navigate to the frontend folder.

Install dependencies (React).

Run the React development server.

The frontend will be available at: http://localhost:3000

###### #### Using the Application

* Create or select an Agent.

* Upload an audio file for transcription.

* Wait for the system to generate a transcript & AI summary.

*AI-powered analytics

Save and manage multiple call histories per agent.

###### Project Workflow ########################

* Audio Upload → User uploads audio file.

* Transcription → FastAPI handles transcription request.

* Summarization → AI generates structured summary + plain summary.

* Storage → Data saved under the agent’s JSON file.

* Frontend Display → React fetches and displays transcription + structured analytics.



##### Architecture diagram #######################

![Architecture](D:\GenAI-Studio\Backend\voice_insights\Frontend\Docs\Voice Insights Architecture Diagram.png)


