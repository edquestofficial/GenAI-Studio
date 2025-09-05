# import os, json, re


# AGENTS_FILE = "agents.json"

# def create_and_save_agent(agent_name, agent_persona, Audio_file):
#     """
#     Creates a new agent entry, saves it to a JSON file.
#     """

#     if not agent_name or not agent_persona or not Audio_file:
#         # print("Error: 'agent_name', 'agent_persona', and 'Audio_file' are mandatory inputs.")
#         return {"error" : " 'agent_name', 'agent_persona', and 'Audio_file' are mandatory inputs."}

#     # Ensure JSON file exists
#     if not os.path.exists(AGENTS_FILE):
#         with open(AGENTS_FILE, "w") as f:
#             json.dump({"agents": []}, f)

#     with open(AGENTS_FILE, "r") as f:
#         data = json.load(f)

#     agents = data.get("agents", [])

#     # Prevent duplicates
#     if any(agent["agent_name"].lower() == agent_name.lower() for agent in agents):
#         return {"error": f"Agent '{agent_name}' already exists. Skipping creation."}


#     # New agent schema
#     new_agent = {
#         "agent_name": agent_name,
#         "agent_persona": agent_persona,
#         "Audio_file": Audio_file,
#     }
#     # Append & save
#     agents.append(new_agent)
#     with open(AGENTS_FILE, "w") as f:
#         json.dump({"agents": agents}, f, indent=4)

#     print(f"Agent '{agent_name}' created and saved successfully.")

#     return new_agent

import os, json, re

AGENTS_DIR = "agents"  # folder to store agent files
os.makedirs(AGENTS_DIR, exist_ok=True)

def create_and_save_agent(agent_name, agent_persona, audio_file):
    """
    Creates a new agent JSON file with given details.
    """
    if not agent_name or not agent_persona or not audio_file:
        return {"error": "'agent_name', 'agent_persona', and 'audio_file' are mandatory inputs."}

    # Sanitize filename (remove spaces/special chars)
    safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', agent_name.lower())
    agent_file = os.path.join(AGENTS_DIR, f"{safe_name}.json")

    if os.path.exists(agent_file):
        return {"error": f"Agent '{agent_name}' already exists."}

    new_agent = {
        "agent_name": agent_name,
        "agent_persona": agent_persona,
        "audio_file": audio_file,
        "transcriptions": []   # place to store transcription results
    }

    with open(agent_file, "w") as f:
        json.dump(new_agent, f, indent=4)

    return new_agent


def save_transcription_to_agent(agent_name, transcription_data):
    """
    Saves transcription results into agent's JSON file.
    """
    safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', agent_name.lower())
    agent_file = os.path.join(AGENTS_DIR, f"{safe_name}.json")

    if not os.path.exists(agent_file):
        return {"error": f"Agent '{agent_name}' not found."}

    with open(agent_file, "r") as f:
        agent_data = json.load(f)

    agent_data.setdefault("transcriptions", [])
    agent_data["transcriptions"].append(transcription_data)

    with open(agent_file, "w") as f:
        json.dump(agent_data, f, indent=4)

    return {"message": f"Transcription saved to {agent_name}.json"}
