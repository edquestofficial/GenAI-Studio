import json
from typing import Optional
from fastapi import FastAPI, Request, HTTPException, Body, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agent import create_and_save_agent
import os
from pinecone import pinecone
from semantic_search import chat_with_rag  # ✅ Import your RAG function

class AgentPayload(BaseModel):
    agent_name: str
    agent_persona: str
    document_path: str
    agent_profile_image: Optional[str] = None

AGENTS_FILE = "agents.json"

app = FastAPI()

@app.post("/knowledgelens/saves_agents", status_code=201, summary="Create multiple new agents")
async def create_multiple_agents(
    agent_name: str = Form(...),
    agent_persona: str = Form(...),
    document: UploadFile = File(...), 
    agent_profile_image: Optional[UploadFile] = File(None)
):
    """
    Saves an agent with its data and uploaded document.
    Each agent will have its own Pinecone index (using agent_name).
    """

    os.makedirs("uploads", exist_ok=True)

    # Save uploaded document
    document_path = f"uploads/{document.filename}"
    with open(document_path, "wb") as f:
        f.write(await document.read())

    # Save profile image if provided
    agent_profile_image_path = None
    if agent_profile_image:
        agent_profile_image_path = f"uploads/{agent_profile_image.filename}"
        with open(agent_profile_image_path, "wb") as f:
            f.write(await agent_profile_image.read())

    # Create & save agent
    response = create_and_save_agent(
        agent_name=agent_name,
        agent_persona=agent_persona,
        document_path=document_path,
        agent_profile_image=agent_profile_image_path
    )
    
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])

    return {"message": response}


@app.delete("/knowledgelens/agents/{agent_name}")
def delete_agent(agent_name: str):
    # Load agents.json
    if not os.path.exists(AGENTS_FILE):
        raise HTTPException(status_code=404, detail="Agents file not found")

    with open(AGENTS_FILE, "r") as f:
        data = json.load(f)

    agents = data.get("agents", [])
    agent_to_delete = next((a for a in agents if a["agent_name"] == agent_name), None)
    if not agent_to_delete:
        raise HTTPException(status_code=404, detail="Agent not found")

    # --- Remove agent from agents.json ---
    new_agents = [a for a in agents if a["agent_name"] != agent_name]
    with open(AGENTS_FILE, "w") as f:
        json.dump({"agents": new_agents}, f, indent=4)

    return {"message": f"Agent '{agent_name}' deleted from JSON."}

class ChatRequest(BaseModel):
    agent_name: str
    user_message: str


@app.post("/knowledgelens/chat")
async def chat_with_agent(req: ChatRequest):
    """
    Accepts agent name and user message.
    Looks up the Pinecone index name from agents.json, then queries RAG.
    """
    if not os.path.exists(AGENTS_FILE):
        raise HTTPException(status_code=404, detail="No agents found.")

    with open(AGENTS_FILE, "r") as f:
        data = json.load(f)

    agents = data.get("agents", [])
    agent = next((a for a in agents if a["agent_name"].lower() == req.agent_name.lower()), None)

    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{req.agent_name}' not found.")

    index_name = agent["index_name"]  

    try:
        answer = chat_with_rag(req.user_message, index_name=index_name)
        return {"agent_name": req.agent_name, "answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@app.get("/knowledgelens/agents")
def get_agents():
    if os.path.exists(AGENTS_FILE):
        with open(AGENTS_FILE, "r") as f:
            data = json.load(f)
            return data.get("agents", [])
    return []


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
