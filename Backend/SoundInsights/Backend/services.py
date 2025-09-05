import os
import time
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Request
from company import save_transcription_to_agent
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import google.generativeai as genai
import torch
from faster_whisper import WhisperModel
import json
import re


load_dotenv()

app = FastAPI()
@app.get('/')
def get():
    return {"message":"ho gya backend se connect."}
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
        google_model = genai.GenerativeModel("gemini-2.0-flash")
    except Exception as e:
        print("Gemini setup failed:", str(e))


def transcribe_audio_logic(file_path, original_filename, agent_name):
    if whisper_model_instance is None:
        return {"error": "Whisper model not available"}

    try:
        segments, info = whisper_model_instance.transcribe(file_path, beam_size=5, language="hi")
        transcribed_text = " ".join([seg.text for seg in segments])

        minutes = int(info.duration // 60)
        seconds = int(info.duration % 60)
        formatted_duration = f"{minutes} minutes and {seconds} seconds"

        transcription_result = {
            "filename": original_filename,
            "transcribedText": transcribed_text,
            "duration": formatted_duration
        }

        # ✅ Save into agent file
        save_transcription_to_agent(agent_name, transcription_result)

        return transcription_result

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}


def summarize_logic(transcribed_text_with_metadata: str):
    """
    Summarize transcribed text using Gemini
    """
    if google_model is None:
        return {"error": "Gemini not available"}

    combined_prompt = f"""
            You are an expert at analyzing transcribed audio conversations and providing structured insights.#     **YOUR RESPONSE MUST CONTAIN ONLY THE JSON OBJECT, NOTHING ELSE, NO INTRODUCTORY OR CONCLUDING REMARKS.**
            Please perform the following analyses on the provided conversation and present the results in a single, well-structured JSON object, enclosed in a markdown JSON code block (```json...```).

            --- Instructions ---
            1.  **General Summary**: Provide a concise summary focusing on key details, requests, and outcomes.
            2.  **Call Metadata**: Extract the original filename, estimated duration, and detected language. If information is not found, use "N/A".
            3.  **Sentiment Analysis**: Categorize the overall sentiment as "Positive", "Negative", "Neutral", or "Mixed", and provide a brief justification.
            4.  **Speaker Estimation**: Estimate the number of distinct speakers. If possible, infer speaking turns or approximate speaking time; otherwise, state that it's not definitively determinable from text alone.
            5.  **Cultural Context**: Analyze for any implied cultural context, norms, or specific references. State "No strong cultural context evident" if none is found.

            --- Expected JSON Output Format (within ```json...```) ---
            ```json
            {{
                "general_summary": "Your summary here.",
                "call_metadata": {{
                    "filename": "audio_file.wav",
                    "duration": "X minutes and Y seconds",
                    "language": "en"
                }},
                "sentiment_analysis": {{
                    "sentiment": "Positive/Negative/Neutral/Mixed",
                    "justification": "Brief reason for sentiment."
                }},
                
                "speakers' duration": {{
                    "speaker x ": "number of minutes/seconds speaker x spoke",
                    "speaker y ": "number of minutes/seconds speaker y spoke."
                }},
                "speaker_estimation": "Estimated number of speakers and details.",
                "cultural_context": "Cultural insights or 'No strong cultural context evident'."
            }}
            ```

            --- Conversation ---
            {transcribed_text_with_metadata}
            --- End of Conversation ---
            """


    try:
        response = google_model.generate_content(combined_prompt)
        print("+"*50)
        print(response)
        print("+"*50)
        json_match = re.search(r'```json\n(.*)\n```', response.text, re.DOTALL)

        if json_match:
            parsed_results = json.loads(json_match.group(1))
            return parsed_results
        else:
            return {"error": "Gemini did not return expected JSON block"}

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}