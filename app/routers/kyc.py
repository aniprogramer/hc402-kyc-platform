from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import UserKYC
from app.db.database import SessionLocal
from app.models.db_user import User
from app.services import ocr, face_match, fraud  
from app.models.status_log import StatusLog
import re

router = APIRouter(prefix="/kyc", tags=["KYC"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def validate_pan(pan: str):
    pattern = r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
    return bool(re.match(pattern, pan))

@router.post("/submit")
def submit_kyc(user: UserKYC, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.user_id == user.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="User ID already exists")

    # PAN validation
    if user.document_type.upper() == "PAN" and not validate_pan(user.document_number):
        raise HTTPException(status_code=400, detail="Invalid PAN format")

    # Save to DB
    db_user = User(
        user_id=user.user_id,
        full_name=user.full_name,
        email=user.email,
        document_type=user.document_type,
        document_number=user.document_number,
        status=user.status
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Run dummy services
    ocr_result = ocr.run_ocr(user.document_number)
    face_result = face_match.run_face_match(user.user_id)
    fraud_result = fraud.run_fraud_check(user.user_id)

    return {
        "message": "KYC submitted",
        "data": user,
        "ocr": ocr_result,
        "face_match": face_result,
        "fraud_check": fraud_result
    }


@router.get("/result/{user_id}")
def get_result(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "document_type": user.document_type,
        "document_number": user.document_number,
        "status": user.status
    }



@router.put("/update/{user_id}")
def update_status(user_id: str, status: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Log the change
    log = StatusLog(user_id=user.user_id, old_status=user.status, new_status=status)
    db.add(log)

    # Update user status
    user.status = status
    db.commit()
    db.refresh(user)

    return {"message": f"Status updated to {status}", "user_id": user.user_id}

@router.get("/logs/{user_id}")
def get_logs(user_id: str, db: Session = Depends(get_db)):
    logs = db.query(StatusLog).filter(StatusLog.user_id == user_id).all()
    return logs



@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
