from fastapi import APIRouter, UploadFile, Form, File
from fastapi.responses import JSONResponse
import os, json, re
from pydantic import BaseModel
from company import create_agent, save_transcription_to_agent
from services import transcribe_audio_logic, summarize_logic

router = APIRouter()

AGENTS_DIR = "agents"
os.makedirs(AGENTS_DIR, exist_ok=True)

# # --- Agent Routes ---
@router.post("/agents/create")
async def create_new_agent(
    agent_name: str = Form(...),
    agent_persona: str = Form(...),
    agent_report:str = Form(...)
):
    """
    Creates an agent with name and persona only (no audio yet).
    """
    try:
        result = create_agent(agent_name, agent_persona, agent_report)
        return result
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


# --- Agent Routes ---
@router.post("/agents")
async def create_new_agent(agent_name: str = Form(...), agent_persona: str = Form(...), agent_report:str = Form(...)):
    """
    Creates an agent with name and persona only (no audio yet).
    Stores in agents/<agent_name>.json.
    """
    try:
        result = create_agent(agent_name, agent_persona, agent_report )
        return result
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@router.get("/agents")
async def list_agents():
    """
    Returns list of all agents with their details.
    """
    agents = []
    for filename in os.listdir(AGENTS_DIR):
        if filename.endswith(".json"):
            with open(os.path.join(AGENTS_DIR, filename), "r", encoding="utf-8") as f:
                agent_data = json.load(f)
            agents.append({
                "agent_name": agent_data.get("agent_name"),
                "agent_persona": agent_data.get("agent_persona"),
                "audios_count": len(agent_data.get("audios", [])),
                "agent_report": agent_data.get("agent_report")
            })
    return {"agents": agents}


@router.get("/agents/{agent_name}/transcriptions")
async def get_transcriptions(agent_name: str):
    print("get the transcriptions.")
    safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', agent_name.lower())
    print(safe_name)
    agent_file = os.path.join(AGENTS_DIR, f"{safe_name}.json")
    print(agent_file)
    if not os.path.exists(agent_file):
        return JSONResponse(content={"error": "Agent not found"}, status_code=404)

    with open(agent_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("audios", [])

# --- Audio Routes ---
@router.post("/audio/transcribe")
async def transcribe_audio(agent_name: str = Form(...), audio: UploadFile = File(...)):
    """
    Transcribes an audio file and saves transcription into agent JSON.
    """
    original_filename = audio.filename
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, original_filename)

    try:
        # Save audio permanently
        with open(file_path, "wb") as f:
            f.write(await audio.read())

        # Call transcription logic → must return (text, duration)
        result = transcribe_audio_logic(file_path, original_filename, agent_name)

        if "error" in result:
            return result

        return result

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


class SummarizeRequest(BaseModel):
    text: str
    agent_name: str
    agent_persona: str
    agent_report: str


@router.post("/audio/summarize")
async def generate_summary(payload: SummarizeRequest):
    text = payload.text
    agent_name = payload.agent_name
    agent_persona = payload.agent_persona
    agent_report = payload.agent_report

    if not text:
        return JSONResponse(content={"error": "No transcribed text provided"}, status_code=400)

    # Generate summary using Gemini (or your logic)
    result = summarize_logic(text, agent_name, agent_persona, agent_report)

    if "error" not in result:
        # --- Get agent file path ---
        safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', agent_name.lower())
        agent_file = os.path.join(AGENTS_DIR, f"{safe_name}.json")

        if not os.path.exists(agent_file):
            return JSONResponse(content={"error": f"Agent '{agent_name}' not found"}, status_code=400)

        # --- Read latest audio ---
        with open(agent_file, "r", encoding="utf-8") as f:
            agent_data = json.load(f)

        if not agent_data.get("audios"):
            return JSONResponse(content={"error": "No audio found for this agent"}, status_code=400)

        latest_audio = agent_data["audios"][-1]

        # --- Save summary to the latest audio ---
        save_transcription_to_agent(
            agent_name=agent_name,
            audio_file_path=latest_audio["audio_path"],
            transcription_text=latest_audio["transcription"],
            duration=latest_audio["duration"],
            summary_text=result
        )

    return result
