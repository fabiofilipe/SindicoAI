from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.routes import api_router
from app.exceptions import AppException
from app.services.scheduler import start_scheduler, shutdown_scheduler
from contextlib import asynccontextmanager
import logging

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    shutdown_scheduler()


app = FastAPI(
    title="SindicoAI API",
    version="0.1.0",
    lifespan=lifespan
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.warning(
        "AppException [%s %s]: %s",
        request.method,
        request.url.path,
        exc.message,
    )
    body: dict = {"detail": exc.message}
    if exc.detail is not None:
        body["errors"] = exc.detail
    return JSONResponse(status_code=exc.status_code, content=body)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend Morador
        "http://localhost:3001",  # Frontend Funcionário
        "http://localhost:3002",  # Frontend Admin
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "SindicoAI Backend"}

@app.get("/")
def read_root():
    return {"message": "Welcome to SindicoAI API"}

app.include_router(api_router, prefix="/api/v1")
