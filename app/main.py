from fastapi import FastAPI
from app.routers import kyc
from app.db.database import Base, engine
from app.models.db_user import User

Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(kyc.router)   

@app.get("/")
def root():
    return {"message": "HC-402 KYC Platform backend is running"}

@app.get("/ping")
def ping():
    return {"status": "ok", "message": "pong"}
