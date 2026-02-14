from fastapi import APIRouter, UploadFile, File
from models.response import APIResponse
import os
import uuid
from datetime import datetime
import random
from sqlalchemy.orm import Session
from database import SessionLocal
from models.kyc_model import KYCSession
from fastapi.responses import FileResponse
from services.report_service import generate_kyc_report



router = APIRouter(prefix="/kyc", tags=["KYC"])

UPLOAD_DIR = "uploads"

@router.post("/upload-id", response_model=APIResponse)
async def upload_id(kyc_id: str,
    file: UploadFile = File(...)):

    # 1️⃣ Validate file type
    allowed_types = ["image/jpeg", "image/png"]

    if file.content_type not in allowed_types:
        return APIResponse(
            success=False,
            message="Invalid file type. Only JPEG and PNG allowed."
        )

    # 2️⃣ Read file contents
    contents = await file.read()

    # 3️⃣ Validate file size (5MB max)
    if len(contents) > 5 * 1024 * 1024:
        return APIResponse(
            success=False,
            message="File too large. Max size is 5MB."
        )

    # 4️⃣ Generate unique filename
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex
    filename = f"{timestamp}_{unique_id}_{file.filename}"

    session_dir = os.path.join(UPLOAD_DIR, kyc_id)

    if not os.path.exists(session_dir):
        os.makedirs(session_dir)

    file_path = os.path.join(session_dir, f"id_{filename}")

    # 5️⃣ Save file
    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    return APIResponse(
        success=True,
        message="ID uploaded successfully",
        data={"filename": filename}
    )

@router.post("/upload-selfie", response_model=APIResponse)
async def upload_selfie(
    kyc_id: str,
    file: UploadFile = File(...)
):
    allowed_types = ["image/jpeg", "image/png"]

    if file.content_type not in allowed_types:
        return APIResponse(
            success=False,
            message="Invalid file type. Only JPEG and PNG allowed."
        )

    contents = await file.read()

    if len(contents) > 5 * 1024 * 1024:
        return APIResponse(
            success=False,
            message="File too large. Max size is 5MB."
        )

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex
    filename = f"{timestamp}_{unique_id}_{file.filename}"

    session_dir = os.path.join(UPLOAD_DIR, kyc_id)

    if not os.path.exists(session_dir):
        os.makedirs(session_dir)

    file_path = os.path.join(session_dir, f"selfie_{filename}")

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    return APIResponse(
        success=True,
        message="Selfie uploaded successfully",
        data={"filename": filename}
    )

@router.post("/verify", response_model=APIResponse)
async def verify_kyc(kyc_id: str):

    session_dir = os.path.join(UPLOAD_DIR, kyc_id)

    if not os.path.exists(session_dir):
        return APIResponse(
            success=False,
            message="KYC session not found"
        )

    ocr_confidence = random.randint(90, 99)
    face_match_score = round(random.uniform(85, 99), 2)
    status = "VERIFIED" if face_match_score > 90 else "REJECTED"

    db: Session = SessionLocal()

    existing = db.query(KYCSession).filter(KYCSession.kyc_id == kyc_id).first()

    if existing:
        existing.ocr_confidence = ocr_confidence
        existing.face_match_score = face_match_score
        existing.status = status
    else:
        new_session = KYCSession(
            kyc_id=kyc_id,
            ocr_confidence=ocr_confidence,
            face_match_score=face_match_score,
            status=status
        )
        db.add(new_session)

    db.commit()
    db.close()

    result = {
        "kyc_id": kyc_id,
        "ocr_confidence": ocr_confidence,
        "face_match_score": face_match_score,
        "status": status
    }

    return APIResponse(
        success=True,
        message="KYC verification completed",
        data=result
    )

@router.get("/result", response_model=APIResponse)
def get_kyc_result(kyc_id: str):

    db: Session = SessionLocal()

    record = db.query(KYCSession).filter(KYCSession.kyc_id == kyc_id).first()
    db.close()

    if not record:
        return APIResponse(
            success=False,
            message="No verification record found"
        )

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
        return APIResponse(
            success=False,
            message="No verification record found"
        )

    session_dir = os.path.join(UPLOAD_DIR, kyc_id)

    report_path = os.path.join(session_dir, f"report_{kyc_id}.pdf")

    kyc_data = {
        "kyc_id": record.kyc_id,
        "ocr_confidence": record.ocr_confidence,
        "face_match_score": record.face_match_score,
        "status": record.status
    }

    generate_kyc_report(kyc_data, report_path)

    return FileResponse(
        report_path,
        media_type="application/pdf",
        filename=f"report_{kyc_id}.pdf"
    )


@router.get("/status")
def kyc_status():
    return {"message": "KYC service ready"}
