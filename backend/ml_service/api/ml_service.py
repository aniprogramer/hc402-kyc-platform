from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import base64
import json
from typing import List, Optional
import uvicorn

from ..ocr.document_ocr import DocumentOCR
from ..face.face_detector import FaceDetector
from ..face.face_matcher import FaceMatcher
from ..face.liveness import LivenessDetector
from ..fraud.document_validator import DocumentValidator
from ..utils.image_processor import ImageProcessor

app = FastAPI(title="KYC ML Service", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
ocr_processor = DocumentOCR()
face_detector = FaceDetector()
face_matcher = FaceMatcher(threshold=0.6)
liveness_detector = LivenessDetector()
document_validator = DocumentValidator()
image_processor = ImageProcessor()

@app.get("/")
async def root():
    return {"message": "KYC ML Service", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ml-service"}

@app.post("/process-document")
async def process_document(file: UploadFile = File(...)):
    """Process document image - OCR and validation"""
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Validate document
        validation_results = document_validator.validate_document_image(image)
        
        # Extract text
        extracted_data = ocr_processor.extract_structured_data(image)
        
        return JSONResponse({
            "success": True,
            "validation": validation_results,
            "extracted_data": extracted_data,
            "document_type": "id_card",  # Add detection logic
        })
    
    except Exception as e:
        return JSONResponse({
            "success": False,
            "error": str(e)
        }, status_code=500)

@app.post("/match-faces")
async def match_faces(
    selfie: UploadFile = File(...),
    document: UploadFile = File(...)
):
    """Match selfie with document photo"""
    try:
        # Read images
        selfie_contents = await selfie.read()
        doc_contents = await document.read()
        
        selfie_img = cv2.imdecode(
            np.frombuffer(selfie_contents, np.uint8), 
            cv2.IMREAD_COLOR
        )
        doc_img = cv2.imdecode(
            np.frombuffer(doc_contents, np.uint8), 
            cv2.IMREAD_COLOR
        )
        
        # Perform face matching
        match_result = face_matcher.match_faces(selfie_img, doc_img)
        
        return JSONResponse({
            "success": True,
            "match_result": match_result
        })
    
    except Exception as e:
        return JSONResponse({
            "success": False,
            "error": str(e)
        }, status_code=500)

@app.post("/detect-faces")
async def detect_faces(file: UploadFile = File(...)):
    """Detect faces in image"""
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        faces = face_detector.detect_faces(image)
        
        return JSONResponse({
            "success": True,
            "face_count": len(faces),
            "faces": faces
        })
    
    except Exception as e:
        return JSONResponse({
            "success": False,
            "error": str(e)
        }, status_code=500)

@app.post("/verify-liveness")
async def verify_liveness(files: List[UploadFile] = File(...)):
    """Verify liveness from multiple frames"""
    try:
        frames = []
        for file in files[:10]:  # Limit to 10 frames
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            frames.append(image)
        
        result = liveness_detector.analyze_liveness_video(frames)
        
        return JSONResponse({
            "success": True,
            "liveness_result": result
        })
    
    except Exception as e:
        return JSONResponse({
            "success": False,
            "error": str(e)
        }, status_code=500)

@app.post("/complete-verification")
async def complete_verification(
    background_tasks: BackgroundTasks,
    selfie: UploadFile = File(...),
    document: UploadFile = File(...),
    video_frames: Optional[List[UploadFile]] = None
):
    """Complete KYC verification pipeline"""
    try:
        # Read images
        selfie_img = cv2.imdecode(
            np.frombuffer(await selfie.read(), np.uint8), 
            cv2.IMREAD_COLOR
        )
        doc_img = cv2.imdecode(
            np.frombuffer(await document.read(), np.uint8), 
            cv2.IMREAD_COLOR
        )
        
        # Step 1: Document validation
        doc_validation = document_validator.validate_document_image(doc_img)
        
        # Step 2: OCR extraction
        extracted_data = ocr_processor.extract_structured_data(doc_img)
        
        # Step 3: Face matching
        face_match = face_matcher.match_faces(selfie_img, doc_img)
        
        # Step 4: Liveness check (if video frames provided)
        liveness_result = None
        if video_frames:
            frames = []
            for frame in video_frames[:5]:
                frame_data = await frame.read()
                frames.append(cv2.imdecode(
                    np.frombuffer(frame_data, np.uint8), 
                    cv2.IMREAD_COLOR
                ))
            if frames:
                liveness_result = liveness_detector.analyze_liveness_video(frames)
        
        # Calculate overall score
        overall_score = 0
        overall_score += doc_validation['quality_score'] * 0.3
        overall_score += extracted_data['confidence_score'] * 0.2
        overall_score += face_match['confidence'] * 0.3
        if liveness_result:
            overall_score += liveness_result['confidence'] * 0.2
        
        # Determine verification status
        verification_status = "VERIFIED" if overall_score >= 70 else "REJECTED"
        
        return JSONResponse({
            "success": True,
            "verification_id": "KYC" + np.random.randint(10000, 99999).astype(str),
            "status": verification_status,
            "overall_score": round(overall_score, 2),
            "details": {
                "document_validation": doc_validation,
                "extracted_data": extracted_data,
                "face_matching": face_match,
                "liveness_check": liveness_result
            },
            "timestamp": str(np.datetime64('now'))
        })
    
    except Exception as e:
        return JSONResponse({
            "success": False,
            "error": str(e)
        }, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)