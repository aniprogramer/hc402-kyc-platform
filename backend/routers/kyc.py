from fastapi import APIRouter, UploadFile, File, HTTPException
from models.response import APIResponse
import os
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from database import SessionLocal
from models.kyc_model import KYCSession
from fastapi.responses import FileResponse
from services.report_service import generate_kyc_report

# 🚀 INTEGRATION: Import your Real AI Services
from services import ocr, face_match

router = APIRouter(prefix="/kyc", tags=["KYC"])

UPLOAD_DIR = "uploads"

# --- 1. UPLOAD ENDPOINTS (Unchanged for Frontend Compatibility) ---

@router.post("/upload-id", response_model=APIResponse)
async def upload_id(kyc_id: str, file: UploadFile = File(...)):
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if file.content_type not in allowed_types:
        return APIResponse(success=False, message="Invalid file type. Only JPEG and PNG allowed.")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        return APIResponse(success=False, message="File too large. Max size is 5MB.")

    # Save file with distinct prefix
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex
    filename = f"{timestamp}_{unique_id}_{file.filename}"
    
    session_dir = os.path.join(UPLOAD_DIR, kyc_id)
    os.makedirs(session_dir, exist_ok=True)
    
    # Remove old ID files to avoid confusion
    for f in os.listdir(session_dir):
        if f.startswith("id_"):
            os.remove(os.path.join(session_dir, f))

    file_path = os.path.join(session_dir, f"id_{filename}")
    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    return APIResponse(success=True, message="ID uploaded successfully", data={"filename": filename})

@router.post("/upload-selfie", response_model=APIResponse)
async def upload_selfie(kyc_id: str, file: UploadFile = File(...)):
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if file.content_type not in allowed_types:
        return APIResponse(success=False, message="Invalid file type. Only JPEG and PNG allowed.")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        return APIResponse(success=False, message="File too large. Max size is 5MB.")

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex
    filename = f"{timestamp}_{unique_id}_{file.filename}"
    
    session_dir = os.path.join(UPLOAD_DIR, kyc_id)
    os.makedirs(session_dir, exist_ok=True)

    # Remove old Selfie files
    for f in os.listdir(session_dir):
        if f.startswith("selfie_"):
            os.remove(os.path.join(session_dir, f))

    file_path = os.path.join(session_dir, f"selfie_{filename}")
    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    return APIResponse(success=True, message="Selfie uploaded successfully", data={"filename": filename})


# --- 2. VERIFY ENDPOINT (🚀 UPGRADED WITH REAL AI) ---

@router.post("/verify", response_model=APIResponse)
async def verify_kyc(kyc_id: str):
    session_dir = os.path.join(UPLOAD_DIR, kyc_id)
    
    if not os.path.exists(session_dir):
        return APIResponse(success=False, message="KYC session not found. Please upload files first.")

    # 🔍 Locate the files dynamically
    try:
        files = os.listdir(session_dir)
        id_filename = next((f for f in files if f.startswith("id_")), None)
        selfie_filename = next((f for f in files if f.startswith("selfie_")), None)

        if not id_filename or not selfie_filename:
            return APIResponse(success=False, message="Missing ID or Selfie. Please upload both.")

        id_path = os.path.join(session_dir, id_filename)
        selfie_path = os.path.join(session_dir, selfie_filename)

        # 🧠 CALL REAL AI SERVICES
        # 1. Face Match
        face_result = face_match.run_face_match(id_path, selfie_path)
        face_score = face_result.get("confidence", 0.0)

        # 2. OCR (Extract text)
        ocr_result = ocr.run_ocr(id_path)
        ocr_text = ocr_result.get("text", "")
        # For hackathon, we assume OCR success if we got any text
        ocr_conf = 95.0 if ocr_result.get("success") else 0.0

        # 3. Decision Logic
        status = "VERIFIED" if face_score > 80 else "REJECTED"

    except Exception as e:
        print(f"AI Error: {str(e)}")
        return APIResponse(success=False, message=f"AI Processing Failed: {str(e)}")

    # 💾 Update Database
    db: Session = SessionLocal()
    existing = db.query(KYCSession).filter(KYCSession.kyc_id == kyc_id).first()

    if existing:
        existing.ocr_confidence = ocr_conf
        existing.face_match_score = face_score
        existing.status = status
    else:
        new_session = KYCSession(
            kyc_id=kyc_id,
            ocr_confidence=ocr_conf,
            face_match_score=face_score,
            status=status
        )
        db.add(new_session)

    db.commit()
    db.close()

    return APIResponse(
        success=True,
        message="KYC verification completed",
        data={
            "kyc_id": kyc_id,
            "face_match_score": face_score,
            "ocr_detected": bool(ocr_text),
            "status": status
        }
    )

# --- 3. HELPER ENDPOINTS (Unchanged) ---

@router.get("/result", response_model=APIResponse)
def get_kyc_result(kyc_id: str):
    db: Session = SessionLocal()
    record = db.query(KYCSession).filter(KYCSession.kyc_id == kyc_id).first()
    db.close()

    if not record:
        return APIResponse(success=False, message="No verification record found")

    return APIResponse(
        success=True,
        message="KYC result retrieved",
        data={
            "kyc_id": record.kyc_id,
            "ocr_confidence": record.ocr_confidence,
            "face_match_score": record.face_match_score,
            "status": record.status
        }
    )

@router.post("/generate-report")
def generate_report(kyc_id: str):
    db: Session = SessionLocal()
    record = db.query(KYCSession).filter(KYCSession.kyc_id == kyc_id).first()
    db.close()

    if not record:
        return APIResponse(success=False, message="No record found")

    session_dir = os.path.join(UPLOAD_DIR, kyc_id)
    report_path = os.path.join(session_dir, f"report_{kyc_id}.pdf")

    kyc_data = {
        "kyc_id": record.kyc_id,
        "ocr_confidence": record.ocr_confidence,
        "face_match_score": record.face_match_score,
        "status": record.status
    }

    generate_kyc_report(kyc_data, report_path)

    return FileResponse(report_path, media_type="application/pdf", filename=f"report_{kyc_id}.pdf")

@router.get("/status")
def kyc_status():
    return {"message": "KYC service ready"}