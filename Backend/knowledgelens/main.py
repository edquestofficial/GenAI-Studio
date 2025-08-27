import json
from typing import Optional, List
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from agent import create_and_save_agent

class AgentPayload(BaseModel):
    agent_name: str
    agent_persona: str
    document_path: str
    agent_profile_image: Optional[str] = None

app = FastAPI()


@app.post("/knowledgelens/saves_agents", status_code=201, summary="Create multiple new agents")
def create_multiple_agents(agents: List[AgentPayload]):
    """
    Saves a list of agents to the agents.json file.
    
    This endpoint iterates through the provided list and calls the
    'create_and_save_agent' function for each agent.
    """
    for agent_data in agents:
        
        create_and_save_agent(
            agent_name=agent_data.agent_name,
            agent_persona=agent_data.agent_persona,
            document_path=agent_data.document_path,
            agent_profile_image=agent_data.agent_profile_image
        )
    
    return {"message": f"Successfully processed {len(agents)} agents."}

@app.put("/knowledgelens/insert_into_pinecone")
def insert_data(file_path):
    return {"message": "Data inserted successfully."}
    
@app.get("/knowledgelens/user_query")
def retrieve_data(query: str):
    return {"response": "Response from pinecone"}
