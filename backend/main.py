from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from logging_config import setup_logging
from routers import health, kyc
from services.file_service import ensure_upload_dir

from database import engine
from models.kyc_model import KYCSession


setup_logging()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION
)

KYCSession.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
ensure_upload_dir(settings.UPLOAD_DIR)

# Include routers
app.include_router(health.router)
app.include_router(kyc.router)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.API_VERSION
    }
