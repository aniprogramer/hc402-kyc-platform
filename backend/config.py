import os

class Settings:
    APP_NAME = "HC-402 KYC Platform"
    API_VERSION = "v1"
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")

settings = Settings()
