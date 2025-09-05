# from fastapi import FastAPI, UploadFile, Form
# from fastapi.middleware.cors import CORSMiddleware
# import os

# # Import helper functions
# from company import save_company, load_companies

# app = FastAPI()

# # Allow frontend (React etc.) to call API
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # for dev, allow all. Restrict in prod.
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/upload/")
# async def upload_company(company_name: str = Form(...), file: UploadFile = None):
#     """API to upload company name + file (PDF, audio, etc.)"""
#     if not file:
#         return {"error": "No file uploaded"}

#     # Save uploaded file
#     upload_dir = "uploads"
#     os.makedirs(upload_dir, exist_ok=True)
#     file_path = os.path.join(upload_dir, file.filename)

#     with open(file_path, "wb") as f:
#         f.write(await file.read())

#     # Save to JSON
#     result = save_company(company_name, file_path)
#     return result


# @app.get("/companies/")
# async def get_companies():
#     """Get all companies + file paths"""
#     return load_companies()


from fastapi import APIRouter, UploadFile, Form, File, Request
from fastapi.responses import JSONResponse
import os, json

from company import save_transcription_to_agent, create_and_save_agent
from services import transcribe_audio_logic, summarize_logic

router = APIRouter()

# --- Agent Routes ---
@router.post("/agents/upload")
async def upload_agent(
    agent_name: str = Form(...),
    agent_persona: str = Form(...),
    audio_file: UploadFile = File(...)
):
    if not audio_file:
        return {"error": "No audio file uploaded"}

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, audio_file.filename)

    # Save the uploaded audio file
    with open(file_path, "wb") as f:
        f.write(await audio_file.read())

    # Create agent JSON
    result = create_and_save_agent(agent_name, agent_persona, file_path)
    return result


@router.get("/agents")
async def get_agents():
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
@router.get("/audio/")
def read_root():
    return {"message": "hello manjeet"}


@router.post("/audio/transcribe")
async def transcribe_audio(
    agent_name: str = Form(...),
    audio: UploadFile = File(...)
):
    original_filename = audio.filename
    temp_audio_dir = "temp_uploads"
    os.makedirs(temp_audio_dir, exist_ok=True)
    temp_audio_path = os.path.join(
        temp_audio_dir, f"temp_{os.urandom(8).hex()}_{original_filename}"
    )

    try:
        with open(temp_audio_path, "wb") as f:
            f.write(await audio.read())

        # Call transcription logic and save into agent file
        result = transcribe_audio_logic(temp_audio_path, original_filename, agent_name)
        return result

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)


@router.post("/audio/summarize")
async def generate_summary(request: Request):
    data = await request.json()
    text = data.get("text")

    if not text:
        return JSONResponse(content={"error": "No transcribed text provided"}, status_code=400)

    result = summarize_logic(text)
    return result

