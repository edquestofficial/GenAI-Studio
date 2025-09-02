import os, json, re
from data_insertion import upload_documents_to_pinecone
from semantic_search import retrieve_documents, build_rag_chain, chat_with_rag

AGENTS_FILE = "agents.json"

def create_and_save_agent(agent_name, agent_persona, document_path, agent_profile_image=None):
    """
    Creates a new agent entry, saves it to a JSON file, uploads its document to Pinecone,
    and optionally tests retrieval + RAG.
    """

    if not agent_name or not agent_persona or not document_path:
        # print("Error: 'agent_name', 'agent_persona', and 'document_path' are mandatory inputs.")
        return {"error" : " 'agent_name', 'agent_persona', and 'document_path' are mandatory inputs."}

    # Ensure JSON file exists
    if not os.path.exists(AGENTS_FILE):
        with open(AGENTS_FILE, "w") as f:
            json.dump({"agents": []}, f)

    with open(AGENTS_FILE, "r") as f:
        data = json.load(f)

    agents = data.get("agents", [])

    # Prevent duplicates
    if any(agent["agent_name"].lower() == agent_name.lower() for agent in agents):
        return {"error": f"Agent '{agent_name}' already exists. Skipping creation."}

    # Generate index_name
    safe_name = re.sub(r'[^a-z0-9-]', '-', agent_name.lower())
    index_name = f"{safe_name}-index"

    # New agent schema
    new_agent = {
        "agent_name": agent_name,
        "agent_persona": agent_persona,
        "document_path": document_path,
        "agent_profile_image": agent_profile_image,
        "index_name": index_name
    }
    if agent_profile_image:
        new_agent["agent_profile_image"] = agent_profile_image

    # Append & save
    agents.append(new_agent)
    with open(AGENTS_FILE, "w") as f:
        json.dump({"agents": agents}, f, indent=4)

    print(f"Agent '{agent_name}' created and saved successfully.")

    # --- Upload to Pinecone ---
    try:
        if os.path.exists(document_path):
            print(f"Uploading document for '{agent_name}' to Pinecone (index: {index_name})...")
            upload_documents_to_pinecone(index_name=index_name, pdf_path=document_path)
            print("Document upload to Pinecone complete.")

            # Simple smoke test
            user_query = "What is the main idea of the document?"

    #         retrieved_chunks = retrieve_documents(index_name=index_name, query=user_query)
    #         # print("Retrieved Chunks:", retrieved_chunks)

    #         rag_response = build_rag_chain(index_name=index_name, text_query=user_query)
    #         # print("RAG Response:", rag_response)

    #         get_answers = chat_with_rag(user_message=user_query, index_name=index_name)
    #         print("Chatbot Answer:", get_answers)

    #     else:
    #         print(f"Document path '{document_path}' does not exist. Skipping Pinecone upload.")

    except Exception as e:
        print(f"Failed to upload document or test RAG chain: {e}")

    return new_agent
