import os
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

def upload_documents_to_pinecone(index_name, pdf_path):
    """
    Loads a PDF, splits it into chunks, and uploads the chunks as embeddings to Pinecone.
    """
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=200,
        chunk_overlap=20
    )
    chunks = splitter.split_documents(docs)
    print(f"Split document into {len(chunks)} chunks.")

    PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
    if not PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY environment variable not set.")
    
    pc = Pinecone(api_key=PINECONE_API_KEY)
    
    embed_model = HuggingFaceEmbeddings() 

  
    if index_name not in pc.list_indexes().names():
        print(f"Creating Pinecone index '{index_name}' with dimension 768...")
        pc.create_index(
            name=index_name,
            dimension=768,
            spec={"serverless": {"cloud": "aws", "region": "us-east-1"}}
        )
        print("Index created successfully.")
    else:
        print(f"Skipping index creation. Index '{index_name}' already exists.")
    
    embeddings = embed_model.embed_documents([chunk.page_content for chunk in chunks])
    vectors_to_upsert = [
    {
        "id": str(i),
        "values": embeddings[i],
        "metadata": {"chunk_text": chunks[i].page_content}
    }
    for i in range(len(chunks))
]

    dense_index = pc.Index(index_name)
    dense_index.upsert(vectors_to_upsert)
    print(f"Successfully uploaded {len(vectors_to_upsert)} vectors to '{index_name}'.")

if __name__ == '__main__':
    index_name = "knowledgelens"
    pdf_path = os.environ.get("pdf_path")
    
    if not pdf_path:
        print("Error: 'pdf_path' environment variable not set. Please set it in your .env file.")
    else:
        upload_documents_to_pinecone(index_name, pdf_path)