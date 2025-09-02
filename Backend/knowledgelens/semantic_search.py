import os
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from data_insertion import upload_documents_to_pinecone

load_dotenv()

# ------------------ Document Retrieval ------------------ #
def retrieve_documents(index_name, query, top_k=1):
    """
    Retrieves relevant document chunks from a Pinecone index for a given query.
    """
    PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
    if not PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY environment variable not set.")
    
    pc = Pinecone(api_key=PINECONE_API_KEY)
    embed_model = HuggingFaceEmbeddings()
    query_vector = embed_model.embed_query(query)

    dense_index = pc.Index(index_name)
    results = dense_index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True
    )
    
    retrieved_chunks = [match.metadata['chunk_text'] for match in results.matches]
    return retrieved_chunks



# ------------------ RAG Chain ------------------ #
def build_rag_chain(index_name, text_query, agent_persona="A helpful assistant.", top_k=1):
    # Retrieve relevant document chunks
    retriever = retrieve_documents(index_name, text_query, top_k=top_k)
    context_text = "\n\n".join(retriever)

    # Initialize LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.2,
        max_output_tokens=1024,
        google_api_key=os.environ.get("GEMINI_API_KEY")
    )

    # System prompt
    system_prompt = (
        f"You are a friendly chatbot with the following persona:\n\n"
        f"{agent_persona}\n\n"
        "Adopt the tone, style, and behavior described in this persona while responding. "
        "Always stay in character. Your response hierarchy is as follows:\n\n"
        "1. Use the provided document to answer the question completely.\n"
        "2. If the answer is not found in the document or your knowledge, politely say, 'I could not find it in the document.'\n" 
        "3. Keep the response concise and to the point.\n\n"
        "Note: You can use your own knowledge to respond to common greetings such as 'hello' or 'how are you.'"
    )

    # Build prompt using valid role-content format
    prompt = ChatPromptTemplate.from_messages([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Question: {text_query}\n\nContext:\n{context_text}"}
    ])

    # Combine prompt and LLM
    rag_chain = prompt | llm

    # Invoke chain
    response_object = rag_chain.invoke({"question": text_query, "context": context_text})
    return response_object.content


# ------------------ Chat Interface ------------------ #
def chat_with_rag(user_message, index_name, agent_persona="A helpful assistant."):
    """
    Function to chat with agent-specific RAG system.
    """
    try:
        response = build_rag_chain(index_name, user_message, agent_persona=agent_persona)
        return response
    except Exception as e:
        return f"Error: {e}"
