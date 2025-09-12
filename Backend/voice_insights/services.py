import os, traceback, json, re
from dotenv import load_dotenv
import google.generativeai as genai
import torch
from faster_whisper import WhisperModel
from company import save_transcription_to_agent  

load_dotenv()

# --- Whisper setup ---
device = "cuda" if torch.cuda.is_available() else "cpu"
compute_type = "float16" if device == "cuda" else "int8"

whisper_model_instance = None
try:
    whisper_model_instance = WhisperModel("large-v3", device=device, compute_type=compute_type)
except Exception as e:
    print("Whisper model failed:", str(e))

# --- Gemini setup ---
google_model = None
gemini_api_key = os.getenv("GOOGLE_API_KEY")

if gemini_api_key:
    try:
        genai.configure(api_key=gemini_api_key)

        # Try latest stable version first
        try:
            google_model = genai.GenerativeModel("gemini-2.0-flash")
        except Exception:
            print("gemini-2.0-flash not available, falling back to gemini-1.5-flash")
            google_model = genai.GenerativeModel("gemini-1.5-flash")

        print("✅ Gemini model initialized successfully")

    except Exception as e:
        print(" Gemini setup failed:")
        traceback.print_exc()
else:
    print(" GOOGLE_API_KEY not found in environment variables")



def transcribe_audio_logic(file_path, original_filename, agent_name):
    """
    Runs Whisper transcription, saves results in agent JSON.
    Returns transcription text and duration for saving.
    """
    if whisper_model_instance is None:
        return {"error": "Whisper model not available"}

    try:
        segments, info = whisper_model_instance.transcribe(file_path, beam_size=5, language="hi")
        transcribed_text = " ".join([seg.text for seg in segments])

        minutes = int(info.duration // 60)
        seconds = int(info.duration % 60)
        formatted_duration = f"{minutes} minutes and {seconds} seconds"

        # Save into agent JSON (using new save_audio_to_agent)
        save_transcription_to_agent(
            agent_name=agent_name,
            audio_file_path=file_path,
            transcription_text=transcribed_text,
            duration=formatted_duration,
        )

        # Return structured response
        return {
            "agent_name": agent_name,
            "transcribedText": transcribed_text,
            "duration": formatted_duration,
            "audio_path": file_path,
        }

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}
    
def summarize_logic(transcribed_text_with_metadata: str, agent_name: str, agent_persona: str, agent_report: str):
    """
    Summarize transcribed text using Gemini.
    Always return English summary + only the fields defined in agent_report.
    """
    if google_model is None:
        return {"error": "Gemini not available"}

    combined_prompt = f"""
        You are an expert at analyzing sales/customer conversations.
        The persona of the agent is: {agent_persona}.

        Task:
        1. Summarize the transcription into clear English.
        2. Extract only the following details as specified in the agent_report:
           {agent_report}

        Rules:
        - ONLY return a JSON object inside a markdown JSON block (```json ...```).
        - JSON must contain:
            - "summary": (string) English summary of the transcription.
            - Additional fields exactly as requested in agent_report.
        - Do NOT include any fields not requested.
        - Do NOT include any extra text outside the JSON block.

        Transcription:
        {transcribed_text_with_metadata}
    """

    try:
        response = google_model.generate_content(combined_prompt)
        text_output = response.text.strip()

        # --- Extract JSON from ```json ... ``` block ---
        match = re.search(r"```json\s*(.*?)```", text_output, re.DOTALL)
        if match:
            json_str = match.group(1).strip()
            return json.loads(json_str)
        else:
            return {"error": "Model did not return valid JSON", "raw_output": text_output}

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}

