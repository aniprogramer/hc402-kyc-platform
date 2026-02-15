# from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# import cv2
# import numpy as np
# from io import BytesIO
# from PIL import Image
# import base64
# import json
# from typing import List, Optional
# import uvicorn
# from ..ocr.document_ocr import DocumentOCR
# from ..face.face_detector import FaceDetector
# from ..face.face_matcher import FaceMatcher
# from ..face.liveness import LivenessDetector
# from ..fraud.document_validator import DocumentValidator
# from ..utils.image_processor import ImageProcessor

# app = FastAPI(title="KYC ML Service", version="1.0.0")

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize components
# ocr_processor = DocumentOCR()
# face_detector = FaceDetector()
# face_matcher = FaceMatcher(threshold=0.6)
# liveness_detector = LivenessDetector()
# document_validator = DocumentValidator()
# image_processor = ImageProcessor()

# @app.get("/")
# async def root():
#     return {"message": "KYC ML Service", "status": "active"}

# @app.get("/health")
# async def health_check():
#     return {"status": "healthy", "service": "ml-service"}

# @app.post("/process-document")
# async def process_document(file: UploadFile = File(...)):
#     """Process document image - OCR and validation"""
#     try:
#         # Read image
#         contents = await file.read()
#         nparr = np.frombuffer(contents, np.uint8)
#         image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
#         # Validate document
#         validation_results = document_validator.validate_document_image(image)
        
#         # Extract text
#         extracted_data = ocr_processor.extract_structured_data(image)
        
#         return JSONResponse({
#             "success": True,
#             "validation": validation_results,
#             "extracted_data": extracted_data,
#             "document_type": "id_card",  # Add detection logic
#         })
    
#     except Exception as e:
#         return JSONResponse({
#             "success": False,
#             "error": str(e)
#         }, status_code=500)

# @app.post("/match-faces")
# async def match_faces(
#     selfie: UploadFile = File(...),
#     document: UploadFile = File(...)
# ):
#     """Match selfie with document photo"""
#     try:
#         # Read images
#         selfie_contents = await selfie.read()
#         doc_contents = await document.read()
        
#         selfie_img = cv2.imdecode(
#             np.frombuffer(selfie_contents, np.uint8), 
#             cv2.IMREAD_COLOR
#         )
#         doc_img = cv2.imdecode(
#             np.frombuffer(doc_contents, np.uint8), 
#             cv2.IMREAD_COLOR
#         )
        
#         # Perform face matching
#         match_result = face_matcher.match_faces(selfie_img, doc_img)
        
#         return JSONResponse({
#             "success": True,
#             "match_result": match_result
#         })
    
#     except Exception as e:
#         return JSONResponse({
#             "success": False,
#             "error": str(e)
#         }, status_code=500)

# @app.post("/detect-faces")
# async def detect_faces(file: UploadFile = File(...)):
#     """Detect faces in image"""
#     try:
#         contents = await file.read()
#         nparr = np.frombuffer(contents, np.uint8)
#         image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
#         faces = face_detector.detect_faces(image)
        
#         return JSONResponse({
#             "success": True,
#             "face_count": len(faces),
#             "faces": faces
#         })
    
#     except Exception as e:
#         return JSONResponse({
#             "success": False,
#             "error": str(e)
#         }, status_code=500)

# @app.post("/verify-liveness")
# async def verify_liveness(files: List[UploadFile] = File(...)):
#     """Verify liveness from multiple frames"""
#     try:
#         frames = []
#         for file in files[:10]:  # Limit to 10 frames
#             contents = await file.read()
#             nparr = np.frombuffer(contents, np.uint8)
#             image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#             frames.append(image)
        
#         result = liveness_detector.analyze_liveness_video(frames)
        
#         return JSONResponse({
#             "success": True,
#             "liveness_result": result
#         })
    
#     except Exception as e:
#         return JSONResponse({
#             "success": False,
#             "error": str(e)
#         }, status_code=500)

# @app.post("/complete-verification")
# async def complete_verification(
#     background_tasks: BackgroundTasks,
#     selfie: UploadFile = File(...),
#     document: UploadFile = File(...),
#     video_frames: Optional[List[UploadFile]] = None
# ):
#     """Complete KYC verification pipeline"""
#     try:
#         # Read images
#         selfie_img = cv2.imdecode(
#             np.frombuffer(await selfie.read(), np.uint8), 
#             cv2.IMREAD_COLOR
#         )
#         doc_img = cv2.imdecode(
#             np.frombuffer(await document.read(), np.uint8), 
#             cv2.IMREAD_COLOR
#         )
        
#         # Step 1: Document validation
#         doc_validation = document_validator.validate_document_image(doc_img)
        
#         # Step 2: OCR extraction
#         extracted_data = ocr_processor.extract_structured_data(doc_img)
        
#         # Step 3: Face matching
#         face_match = face_matcher.match_faces(selfie_img, doc_img)
        
#         # Step 4: Liveness check (if video frames provided)
#         liveness_result = None
#         if video_frames:
#             frames = []
#             for frame in video_frames[:5]:
#                 frame_data = await frame.read()
#                 frames.append(cv2.imdecode(
#                     np.frombuffer(frame_data, np.uint8), 
#                     cv2.IMREAD_COLOR
#                 ))
#             if frames:
#                 liveness_result = liveness_detector.analyze_liveness_video(frames)
        
#         # Calculate overall score
#         overall_score = 0
#         overall_score += doc_validation['quality_score'] * 0.3
#         overall_score += extracted_data['confidence_score'] * 0.2
#         overall_score += face_match['confidence'] * 0.3
#         if liveness_result:
#             overall_score += liveness_result['confidence'] * 0.2
        
#         # Determine verification status
#         verification_status = "VERIFIED" if overall_score >= 70 else "REJECTED"
        
#         return JSONResponse({
#             "success": True,
#             "verification_id": "KYC" + np.random.randint(10000, 99999).astype(str),
#             "status": verification_status,
#             "overall_score": round(overall_score, 2),
#             "details": {
#                 "document_validation": doc_validation,
#                 "extracted_data": extracted_data,
#                 "face_matching": face_match,
#                 "liveness_check": liveness_result
#             },
#             "timestamp": str(np.datetime64('now'))
#         })
    
#     except Exception as e:
#         return JSONResponse({
#             "success": False,
#             "error": str(e)
#         }, status_code=500)

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8001)

# app/routers/ml.py mein yeh naya endpoint add karo
import os
import tempfile
from pathlib import Path
import shutil
from pdf2image import convert_from_path
import cv2
import numpy as np
import pytesseract
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import face_recognition
import json
import uuid
from datetime import datetime
from io import BytesIO
import base64
from PIL import Image

router = APIRouter(prefix="/api/ml", tags=["ML Services"])

# ==================== CONFIGURATION - PERMANENT STORAGE ====================
# Ye folders permanently save honge
BASE_SAVE_PATH = "extracted_data"  # Main folder
DOCUMENTS_PATH = os.path.join(BASE_SAVE_PATH, "documents")
FACES_PATH = os.path.join(BASE_SAVE_PATH, "faces")
PAGES_PATH = os.path.join(BASE_SAVE_PATH, "pages")
METADATA_PATH = os.path.join(BASE_SAVE_PATH, "metadata")

# Create all directories if they don't exist
os.makedirs(DOCUMENTS_PATH, exist_ok=True)
os.makedirs(FACES_PATH, exist_ok=True)
os.makedirs(PAGES_PATH, exist_ok=True)
os.makedirs(METADATA_PATH, exist_ok=True)

# ==================== MAIN ENDPOINT WITH PERMANENT SAVE ====================
@router.post("/extract-and-save")
async def extract_and_save(file: UploadFile = File(...)):
    """
    PDF/image se text aur face extract karo aur PERMANENTLY save karo
    Files saved in: extracted_data/documents/, extracted_data/faces/, etc.
    """
    try:
        # Create unique ID for this extraction
        extraction_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        print(f"\n🚀 Processing file: {file.filename}")
        print(f"📋 Extraction ID: {extraction_id}")
        
        # Create extraction-specific subfolder (optional)
        extraction_folder = os.path.join(BASE_SAVE_PATH, f"{timestamp}_{extraction_id}")
        os.makedirs(extraction_folder, exist_ok=True)
        
        result = {
            'success': True,
            'extraction_id': extraction_id,
            'timestamp': timestamp,
            'filename': file.filename,
            'file_type': file.content_type,
            'extracted_text': '',
            'face_detected': False,
            'pages': 0,
            'saved_files': {},
            'urls': {}
        }
        
        # Read file
        contents = await file.read()
        
        # Handle PDF files
        if file.filename.lower().endswith('.pdf'):
            print(f"📄 Processing PDF...")
            
            # Save original PDF
            pdf_filename = f"{timestamp}_{extraction_id}_original.pdf"
            pdf_path = os.path.join(DOCUMENTS_PATH, pdf_filename)
            with open(pdf_path, 'wb') as f:
                f.write(contents)
            result['saved_files']['original_pdf'] = pdf_path
            result['urls']['original_pdf'] = f"/api/ml/saved-file?path={pdf_path}"
            
            # Create temp file for conversion
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
                tmp.write(contents)
                tmp_path = tmp.name
            
            # Convert PDF to images
            images = convert_from_path(tmp_path, dpi=300)
            result['pages'] = len(images)
            
            # Process each page
            for i, image in enumerate(images):
                # Convert PIL to OpenCV format
                opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
                
                # Save full page
                page_filename = f"{timestamp}_{extraction_id}_page_{i+1}.jpg"
                page_path = os.path.join(PAGES_PATH, page_filename)
                cv2.imwrite(page_path, opencv_image)
                result['saved_files'][f'page_{i+1}'] = page_path
                
                # Extract text from this page
                page_text = extract_text_from_image(opencv_image)
                result['extracted_text'] += f"\n--- Page {i+1} ---\n{page_text}\n"
                
                # Try to find face in this page
                face_image = extract_face_region(opencv_image)
                if face_image is not None and not result['face_detected']:
                    # Save face image
                    face_filename = f"{timestamp}_{extraction_id}_face.jpg"
                    face_path = os.path.join(FACES_PATH, face_filename)
                    cv2.imwrite(face_path, face_image)
                    
                    result['face_detected'] = True
                    result['saved_files']['face_image'] = face_path
                    result['urls']['face_image'] = f"/api/ml/saved-file?path={face_path}"
                    
                    # Also save the page where face was found as document
                    doc_filename = f"{timestamp}_{extraction_id}_document.jpg"
                    doc_path = os.path.join(DOCUMENTS_PATH, doc_filename)
                    cv2.imwrite(doc_path, opencv_image)
                    result['saved_files']['document_image'] = doc_path
                    result['urls']['document_image'] = f"/api/ml/saved-file?path={doc_path}"
                    
                    print(f"✅ Face detected on page {i+1}")
            
            # If no face found, save first page as document
            if not result['face_detected'] and images:
                doc_filename = f"{timestamp}_{extraction_id}_document.jpg"
                doc_path = os.path.join(DOCUMENTS_PATH, doc_filename)
                images[0].save(doc_path, 'JPEG')
                result['saved_files']['document_image'] = doc_path
                result['urls']['document_image'] = f"/api/ml/saved-file?path={doc_path}"
            
            os.unlink(tmp_path)
        
        # Handle image files
        elif file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
            print(f"🖼️ Processing Image...")
            
            # Read image
            nparr = np.frombuffer(contents, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Save original image
            img_filename = f"{timestamp}_{extraction_id}_original.jpg"
            img_path = os.path.join(DOCUMENTS_PATH, img_filename)
            cv2.imwrite(img_path, image)
            result['saved_files']['original_image'] = img_path
            result['urls']['original_image'] = f"/api/ml/saved-file?path={img_path}"
            
            # Save as document
            doc_filename = f"{timestamp}_{extraction_id}_document.jpg"
            doc_path = os.path.join(DOCUMENTS_PATH, doc_filename)
            cv2.imwrite(doc_path, image)
            result['saved_files']['document_image'] = doc_path
            result['urls']['document_image'] = f"/api/ml/saved-file?path={doc_path}"
            
            # Extract text
            result['extracted_text'] = extract_text_from_image(image)
            
            # Extract face
            face_image = extract_face_region(image)
            if face_image is not None:
                face_filename = f"{timestamp}_{extraction_id}_face.jpg"
                face_path = os.path.join(FACES_PATH, face_filename)
                cv2.imwrite(face_path, face_image)
                
                result['face_detected'] = True
                result['saved_files']['face_image'] = face_path
                result['urls']['face_image'] = f"/api/ml/saved-file?path={face_path}"
                print(f"✅ Face detected")
        
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Save extracted text to file
        text_filename = f"{timestamp}_{extraction_id}_text.txt"
        text_path = os.path.join(DOCUMENTS_PATH, text_filename)
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(result['extracted_text'])
        result['saved_files']['text_file'] = text_path
        result['urls']['text_file'] = f"/api/ml/saved-file?path={text_path}"
        
        # Save metadata JSON
        metadata_filename = f"{timestamp}_{extraction_id}_metadata.json"
        metadata_path = os.path.join(METADATA_PATH, metadata_filename)
        
        # Create metadata copy for saving (without binary data)
        metadata_copy = {
            'extraction_id': extraction_id,
            'timestamp': timestamp,
            'filename': file.filename,
            'file_type': file.content_type,
            'pages': result['pages'],
            'face_detected': result['face_detected'],
            'text_length': len(result['extracted_text']),
            'saved_files': result['saved_files'],
            'urls': result['urls']
        }
        
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata_copy, f, indent=2)
        result['saved_files']['metadata'] = metadata_path
        
        # Save a copy in extraction folder as well
        extraction_metadata = os.path.join(extraction_folder, 'metadata.json')
        with open(extraction_metadata, 'w', encoding='utf-8') as f:
            json.dump(metadata_copy, f, indent=2)
        
        print(f"✅ All files saved successfully!")
        print(f"📁 Extraction folder: {extraction_folder}")
        
        # Return response
        return {
            'success': True,
            'message': 'Document processed and saved successfully',
            'extraction_id': extraction_id,
            'timestamp': timestamp,
            'filename': file.filename,
            'pages': result['pages'],
            'face_detected': result['face_detected'],
            'text_preview': result['extracted_text'][:300] + '...' if len(result['extracted_text']) > 300 else result['extracted_text'],
            'text_length': len(result['extracted_text']),
            'saved_files': result['saved_files'],
            'urls': result['urls']
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {'success': False, 'error': str(e)}

# ==================== HELPER FUNCTIONS ====================
def extract_text_from_image(image):
    """Extract text using OCR"""
    try:
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        text = pytesseract.image_to_string(thresh)
        return text.strip()
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""

def extract_face_region(image):
    """Extract face region from image"""
    try:
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_image)
        
        if face_locations:
            top, right, bottom, left = face_locations[0]
            margin = 20
            h, w = image.shape[:2]
            top = max(0, top - margin)
            bottom = min(h, bottom + margin)
            left = max(0, left - margin)
            right = min(w, right + margin)
            
            return image[top:bottom, left:right]
        return None
    except Exception as e:
        print(f"Face extraction error: {e}")
        return None

# ==================== FILE SERVING ENDPOINT ====================
@router.get("/saved-file")
async def get_saved_file(path: str):
    """Serve saved files securely"""
    try:
        # Security check - only allow files from our directories
        if not (path.startswith(DOCUMENTS_PATH) or 
                path.startswith(FACES_PATH) or 
                path.startswith(PAGES_PATH) or
                path.startswith(METADATA_PATH)):
            raise HTTPException(status_code=403, detail="Access denied")
        
        if os.path.exists(path):
            return FileResponse(path)
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== LIST ALL EXTRACTIONS ====================
@router.get("/list-extractions")
async def list_extractions(limit: int = 20):
    """List all saved extractions with metadata"""
    try:
        extractions = []
        metadata_files = sorted(
            [f for f in os.listdir(METADATA_PATH) if f.endswith('_metadata.json')],
            reverse=True
        )[:limit]
        
        for mf in metadata_files:
            mf_path = os.path.join(METADATA_PATH, mf)
            with open(mf_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                extractions.append({
                    'extraction_id': data.get('extraction_id'),
                    'timestamp': data.get('timestamp'),
                    'filename': data.get('filename'),
                    'pages': data.get('pages'),
                    'face_detected': data.get('face_detected'),
                    'text_length': data.get('text_length'),
                    'urls': data.get('urls', {})
                })
        
        return {
            'success': True, 
            'total': len(extractions),
            'extractions': extractions
        }
    except Exception as e:
        return {'success': False, 'error': str(e)}

# ==================== GET SINGLE EXTRACTION DETAILS ====================
@router.get("/extraction/{extraction_id}")
async def get_extraction(extraction_id: str):
    """Get details of a specific extraction"""
    try:
        # Find metadata file with this extraction_id
        for f in os.listdir(METADATA_PATH):
            if extraction_id in f and f.endswith('_metadata.json'):
                mf_path = os.path.join(METADATA_PATH, f)
                with open(mf_path, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    return {'success': True, 'extraction': data}
        
        return {'success': False, 'error': 'Extraction not found'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

# ==================== DELETE EXTRACTION ====================
@router.delete("/extraction/{extraction_id}")
async def delete_extraction(extraction_id: str):
    """Delete all files for an extraction"""
    try:
        deleted_files = []
        
        # Find and delete all files with this extraction_id
        for root, dirs, files in os.walk(BASE_SAVE_PATH):
            for file in files:
                if extraction_id in file:
                    file_path = os.path.join(root, file)
                    os.remove(file_path)
                    deleted_files.append(file_path)
        
        return {
            'success': True,
            'message': f'Deleted {len(deleted_files)} files',
            'deleted_files': deleted_files
        }
    except Exception as e:
        return {'success': False, 'error': str(e)}

# ==================== ORIGINAL ENDPOINTS (for backward compatibility) ====================
@router.post("/extract-document-data")
async def extract_document_data(file: UploadFile = File(...)):
    """Original endpoint - processes but doesn't save permanently"""
    # ... (your existing code) ...
    pass

@router.post("/extract-document-base64")
async def extract_document_base64(file: UploadFile = File(...)):
    """Original base64 endpoint"""
    # ... (your existing code) ...
    pass