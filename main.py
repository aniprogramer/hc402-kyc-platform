<<<<<<< HEAD
<<<<<<< HEAD
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
=======
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ml  # Import your ML router
=======
from fastapi import FastAPI, UploadFile, File
import shutil
from ml import KYCProcessor
>>>>>>> eb1d57ba ()

app = FastAPI()
processor = KYCProcessor()

@app.post("/verify")
async def verify_kyc(document: UploadFile = File(...)):
    # Save uploaded file temporarily
    temp_path = f"temp_{document.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(document.file, buffer)
    
    # Process
    results = processor.process_input(temp_path)
    os.remove(temp_path) # Cleanup
    
    return results

<<<<<<< HEAD
# Include your ML router
app.include_router(ml.router)

@app.get("/")
async def root():
    return {
        "message": "HC-402 KYC Platform backend is running",
        "version": "1.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
>>>>>>> 697e6f00 (API added)
=======
@app.post("/compare")
async def compare_faces(selfie: UploadFile = File(...), id_face: str = ""):
    # Logic to compare a live selfie against a previously extracted face path
    # (Implementation follows the match_faces logic above)
    pass
>>>>>>> eb1d57ba ()
