from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from logging_config import setup_logging
# 🚀 INTEGRATION: Add 'auth' to the routers list
from routers import health, kyc, auth
from services.file_service import ensure_upload_dir

from database import engine, Base
# 🚀 INTEGRATION: Import all models so Base.metadata knows about them
from models.kyc_model import KYCSession
from models.db_user import User
from models.status_log import StatusLog

setup_logging()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION
)

# 🚀 INTEGRATION: Create ALL tables (Users, Logs, KYCSessions) at once
Base.metadata.create_all(bind=engine)

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
# 🚀 INTEGRATION: Register the Auth routes
app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.API_VERSION
    }