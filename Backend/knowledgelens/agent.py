import json

def create_and_save_agent(agent_name, agent_persona, document_path, agent_profile_image=None):
    """
    Creates a new agent entry, saves it to a JSON file, and prevents duplicates.
    
    Args:
        agent_name (str): The mandatory name of the agent.
        agent_persona (str): The mandatory persona description.
        document_path (str): The mandatory path to the knowledge document.
        agent_profile_image (str, optional): The path to the profile image. Defaults to None.
    """
    if not agent_name or not agent_persona or not document_path:
        print("Error: 'agent_name', 'agent_persona', and 'document_path' are mandatory inputs.")
        return

    new_agent = {
        "agent_name": agent_name,
        "agent_persona": agent_persona,
        "document_path": document_path
    }
    if agent_profile_image:
        new_agent["agent_profile_image"] = agent_profile_image

    try:
        with open('agents.json', 'r+') as f:
            data = json.load(f)
            agents_list = data.get('agents', [])

            if any(agent['agent_name'] == agent_name for agent in agents_list):
                print(f"Agent '{agent_name}' already exists. Skipping creation.")
                return

            agents_list.append(new_agent)
            data['agents'] = agents_list
            f.seek(0)
            json.dump(data, f, indent=4)
            print(f"Agent '{agent_name}' created and saved successfully.")
            
    except FileNotFoundError:
        with open('agents.json', 'w') as f:
            json.dump({"agents": [new_agent]}, f, indent=4)
            print(f"Agent '{agent_name}' created and saved successfully.")          
            
create_and_save_agent(
    agent_name="YogeshBot",
    agent_persona="I am a helpful medical bot that can answer questions about yogesh.",
    agent_profile_image="",
    document_path=r"C:\Users\hi\Desktop\Gen AI Studio\GenAI-Studio\Backend\knowledgelens\medical_chatbot_knowledge_base.pdf"
)

