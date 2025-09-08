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
        print("❌ Gemini setup failed:")
        traceback.print_exc()
else:
    print("❌ GOOGLE_API_KEY not found in environment variables")



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


def summarize_logic(transcribed_text_with_metadata: str, agent_name: str, agent_persona: str):
    """
    Summarize transcribed text using Gemini with structured sales-call categories.
    The response is expected as a JSON object inside a markdown JSON block.
    """
    if google_model is None:
        return {"error": "Gemini not available"}

    combined_prompt = f"""
        You are an expert at analyzing sales/customer conversations.
        The persona of the agent is: {agent_persona}.
        ONLY return a JSON object inside a markdown JSON block (```json ...```).
        Do not include any introductory or concluding text.

        Analyze the conversation in detail and provide insights under the following fields:

        - **opening_and_introduction**: Evaluate how the call started. Was there a polite greeting, self-introduction, and clear statement of purpose? Did the rep set a professional and engaging tone? maximum in 3-4 words
        - **need_discovery_and_qualification**: Assess whether the rep asked probing questions to uncover the customer’s needs, challenges, and goals. Did they qualify the customer (budget, authority, timeline, fit)? maximum in 3-4 words
        - **product_knowledge_distribution**: Measure how effectively the rep explained the product or service. Was the information accurate, clear, confident, and easy to understand? maximum in 3-4 words
        - **offer_presentation_and_value_communication**: Review how the offer was presented. Did the rep emphasize value (benefits, ROI, outcomes) instead of only listing features? maximum in 3-4 words
        - **objection_handling**: Examine how the rep managed customer objections (price, trust, competition, timing). Did they show empathy, provide relevant evidence, and maintain a positive tone? maximum in 3-4 words
        - **closing_and_next_steps**: Evaluate if the rep guided the conversation toward a clear next step (booking a demo, confirming purchase, scheduling follow-up). Was the call wrapped up with clarity? maximum in 3-4 words
        - **call_professionalism**: Comment on the overall professionalism of the call, including politeness, tone, listening skills, turn-taking, and communication clarity. maximum in 3-4 words
        - **sentiment_analysis**: Identify the overall sentiment of the conversation ("Positive", "Negative", "Neutral", or "Mixed") and provide a short justification with supporting evidence from the dialogue. maximum in 3-4 words
        - **plain_summary**: A short, professional human-readable summary of the conversation in English.

        --- Conversation ---
        {transcribed_text_with_metadata}
        --- End of Conversation ---

        --- Expected JSON Output Format (within ```json...```) ---
        ```json
        {{
            "opening_and_introduction": "Analysis here.",
            "need_discovery_and_qualification": "Analysis here.",
            "product_knowledge_distribution": "Analysis here.",
            "offer_presentation_and_value_communication": "Analysis here.",
            "objection_handling": "Analysis here.",
            "closing_and_next_steps": "Analysis here.",
            "call_professionalism": "Analysis here.",
            "sentiment_analysis": {{
                "sentiment": "Positive/Negative/Neutral/Mixed",
                "justification": "Brief reason for sentiment."
            }},
         "plain_summary": "Short and concise summary in English that sounds professional"
     }}
        }}
        """
    try:
        response = google_model.generate_content(contents=combined_prompt)

        raw_output = getattr(response, "text", None) or response.candidates[0].content.parts[0].text

        json_match = re.search(r"```json\s*(.*?)\s*```", raw_output, re.DOTALL)
        if json_match:
            parsed_results = json.loads(json_match.group(1))
            return parsed_results
        else:
            return {
                "error": "Gemini did not return the expected JSON block",
                "raw_response": raw_output,
            }

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}
