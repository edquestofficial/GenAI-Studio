
# 💻 KnowledgeLens Frontend

This is the frontend for the **KnowledgeLens AI Agent Platform**. It provides a simple UI for creating, managing, and chatting with AI-powered agents.

---

##  Features
- Upload documents and create new AI agents
- View all saved agents
- Chat with agents using their knowledge base
- Delete agents (removes from backend)
- Modern responsive UI

---

##  Project Structure

frontend/
│── src/
│ ├── Detail.js      
│ ├── ChatPage.js
│ ├── Form.js
│ └── App.js # App entry point
│── public/
│── package.json
│── README.md

## Workflow

1. Select or create an Agent. Add a name, persona and add the analytics you want to know from the audio file, in agent report.

2. Upload audio file → sent to FastAPI backend

3. Receive transcription + AI summary

4. View structured analytics

## Architechture Diagram

![Knowledge Lens Architecture](Public/Knowledge%20Lens%20Architecture.png)

## Installation

1. Go to Frontend Directory

```bash
cd GenAI-Studio/Frontend
```

2. Install Dependencies

npm install

3. Start Development Server

npm start

(Make Sure that backend is active)

## Tech Stack

React
TailwindCSS



