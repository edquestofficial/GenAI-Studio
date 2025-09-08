import os, json, re

AGENTS_DIR = "agents"
os.makedirs(AGENTS_DIR, exist_ok=True)

# --- Create agent ---
def create_agent(agent_name, agent_persona):
    if not agent_name or not agent_persona:
        return {"error": "'agent_name' and 'agent_persona' are mandatory."}

    safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', agent_name.lower())
    agent_file = os.path.join(AGENTS_DIR, f"{safe_name}.json")

    # If agent exists and valid JSON → return it
    if os.path.exists(agent_file):
        try:
            with open(agent_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError:
            pass  # fallback to create new

    # Create new agent JSON
    agent_data = {"agent_name": agent_name, "agent_persona": agent_persona, "audios": []}
    with open(agent_file, "w", encoding="utf-8") as f:
        json.dump(agent_data, f, indent=2)
    return agent_data


# --- Save transcription (and optional summary) ---
def save_transcription_to_agent(agent_name, audio_file_path, transcription_text, duration, summary_text=None):
    safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', agent_name.lower())
    agent_file = os.path.join(AGENTS_DIR, f"{safe_name}.json")

    if not os.path.exists(agent_file):
        raise FileNotFoundError(f"Agent '{agent_name}' not found")

    with open(agent_file, "r", encoding="utf-8") as f:
        agent_data = json.load(f)

    # Check if audio already exists → update
    for audio in agent_data.get("audios", []):
        if audio["audio_path"] == audio_file_path:
            audio["transcription"] = transcription_text
            audio["duration"] = duration
            if summary_text is not None:
                audio["summary"] = summary_text
            break
    else:
        # New audio entry
        agent_data["audios"].append({
            "audio_path": audio_file_path,
            "transcription": transcription_text,
            "duration": duration,
            "summary": summary_text or ""
        })

    with open(agent_file, "w", encoding="utf-8") as f:
        json.dump(agent_data, f, indent=2, ensure_ascii=False)
    return True

