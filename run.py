import cv2
import os
import shutil
import re
from pathlib import Path
from datetime import datetime
from deepface import DeepFace
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pytesseract

app = FastAPI()

# Directory Setup
BASE_DIR = Path(__file__).parent
DATA_ROOT = BASE_DIR / "kyc_records"
FACE_DB = BASE_DIR / "face_database"

for folder in [DATA_ROOT, FACE_DB]:
    folder.mkdir(exist_ok=True)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ==================== HELPERS ====================

def extract_ocr_data(image_path):
    """Basic OCR to find ID and Type"""
    img = cv2.imread(image_path)
    text = pytesseract.image_to_string(img)
    
    # Simple regex for Doc Type detection
    doc_type = "Document"
    if re.search(r'[A-Z]{5}[0-9]{4}[A-Z]{1}', text): doc_type = "PAN"
    elif re.search(r'\d{4}[\s-]?\d{4}[\s-]?\d{4}', text): doc_type = "Aadhaar"
    elif re.search(r'[A-Z]{2}[0-9]{2}', text): doc_type = "DL"
    
    return doc_type, text

def find_existing_identity(face_crop_path):
    """Returns folder name if face exists in DB, else None"""
    try:
        if not any(FACE_DB.glob("*.jpg")):
            return None
        
        # Search the database for a match
        results = DeepFace.find(img_path=str(face_crop_path), db_path=str(FACE_DB), 
                                model_name='Facenet', enforce_detection=False, silent=True)
        
        if len(results) > 0 and not results[0].empty:
            matched_img_path = results[0].iloc[0]['identity']
            return Path(matched_img_path).stem # Returns "Person_1"
        return None
    except Exception as e:
        print(f"Match error: {e}")
        return None

# ==================== ENDPOINT ====================

@app.post("/process-document")
async def process_document(file: UploadFile = File(...)):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # 1. Save file to a temp location first
    temp_dir = BASE_DIR / "temp"
    temp_dir.mkdir(exist_ok=True)
    temp_file_path = temp_dir / file.filename
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Extract Face for Identification
    person_id = "Unknown_User"
    try:
        face_objs = DeepFace.extract_faces(img_path=str(temp_file_path), enforce_detection=False)
        if face_objs:
            # Save temporary face for matching
            face_img = (face_objs[0]['face'] * 255).astype('uint8')
            face_img = cv2.cvtColor(face_img, cv2.COLOR_RGB2BGR)
            temp_face_path = temp_dir / f"face_{timestamp}.jpg"
            cv2.imwrite(str(temp_face_path), face_img)

            # Check if this person exists
            existing_id = find_existing_identity(temp_face_path)
            
            if existing_id:
                person_id = existing_id
            else:
                # Create new identity
                person_count = len(list(FACE_DB.glob("*.jpg"))) + 1
                person_id = f"Person_{person_count}"
                # Add to database for future matching
                shutil.copy(temp_face_path, FACE_DB / f"{person_id}.jpg")
    except Exception as e:
        print(f"Face processing error: {e}")

    # 3. OCR and Final Folder Creation
    doc_type, raw_text = extract_ocr_data(str(temp_file_path))
    
    # Structure: kyc_records/Person_1/20260215_Aadhaar/
    save_folder = DATA_ROOT / person_id / f"{timestamp}_{doc_type}"
    save_folder.mkdir(parents=True, exist_ok=True)

    # 4. Move files to final destination
    shutil.move(str(temp_file_path), save_folder / file.filename)
    with open(save_folder / "ocr_content.txt", "w") as f:
        f.write(raw_text)

    return {
        "status": "success",
        "identified_as": person_id,
        "folder": str(save_folder),
        "document_detected": doc_type
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)