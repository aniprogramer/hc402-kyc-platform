from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.db_user import User
from models.schemas import UserCreate, UserLogin
from services.auth import hash_password, verify_password, create_access_token
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    kyc_id = f"HC-{uuid.uuid4().hex[:8].upper()}"

    new_user = User(
        user_id=kyc_id,
        full_name=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        status="active"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered", "kyc_id": new_user.user_id}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "kyc_id": db_user.user_id,
        "full_name": db_user.full_name
    }