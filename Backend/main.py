from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from voice_insights.Backend.routesfile import router as voice_insights

app = FastAPI()

app.include_router(voice_insights, prefix="/voice-insights")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Multi-project FastAPI "}

