import os
import json
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_huggingface import HuggingFaceEmbeddings
from data_insertion import upload_documents_to_pinecone

load_dotenv()

def retrieve_documents(index_name, query, top_k=3):
    """
    Retrieves the most relevant document chunks from a Pinecone index for a given query.
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
    
    print(f"\nRetrieved {len(retrieved_chunks)} relevant chunks from Pinecone.")
    return retrieved_chunks


if __name__ == '__main__':
    index_name = "knowledgelens"
    pdf_path = os.environ.get("pdf_path")
    
    if not pdf_path:
        print("Error: 'pdf_path' environment variable not set. Please set it in your .env file.")
    else:
        print("Uploading documents to Pinecone. This may take a moment...")
        upload_documents_to_pinecone(index_name, pdf_path)
        
        user_query = "What is common cold?"
        relevant_docs = retrieve_documents(index_name, user_query)
        
        print("\n--- Retrieved Documents ---")
        for i, doc in enumerate(relevant_docs):
            print(f"Chunk {i+1}:")
            print(doc)
            print("-" * 20)
