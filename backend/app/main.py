from fastapi import FastAPI
from app.api.routes import api_router

app = FastAPI(title="SindicoAI API", version="0.1.0")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "SindicoAI Backend"}

@app.get("/")
def read_root():
    return {"message": "Welcome to SindicoAI API"}

app.include_router(api_router, prefix="/api/v1")
