from fastapi import APIRouter, UploadFile, Form, File, Request
from fastapi.responses import JSONResponse
import os, json, re
from pydantic import BaseModel
from company import create_agent, save_transcription_to_agent
from services import transcribe_audio_logic, summarize_logic

router = APIRouter()

# --- Agent Routes ---
@router.post("/agents/create")
async def create_new_agent(
    agent_name: str = Form(...),
    agent_persona: str = Form(...)
):
    """
    Creates an agent with name and persona only (no audio yet).
    """
    try:
        result = create_agent(agent_name, agent_persona)
        return result
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)



@router.get("/agents")
async def get_agents():
    """
    Returns list of all agents with their details.
    """
    agents_dir = "agents"
    if not os.path.exists(agents_dir):
        return []

    agents = []
    for file in os.listdir(agents_dir):
        if file.endswith(".json"):
            with open(os.path.join(agents_dir, file)) as f:
                agents.append(json.load(f))
    return agents


# --- Audio Routes ---
@router.post("/audio/transcribe")
async def transcribe_audio(
    agent_name: str = Form(...),
    audio: UploadFile = File(...)
):
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


@router.post("/audio/summarize")
async def generate_summary(payload: SummarizeRequest):
    text = payload.text
    agent_name = payload.agent_name
    agent_persona = payload.agent_persona

    if not text:
        return JSONResponse(content={"error": "No transcribed text provided"}, status_code=400)

    # Generate summary using Gemini
    result = summarize_logic(text, agent_name, agent_persona)

    if "error" not in result:
        # --- Get agent file path ---
        safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', agent_name.lower())
        agent_file = os.path.join("agents", f"{safe_name}.json")

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
