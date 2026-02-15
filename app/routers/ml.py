import os
import cv2
import pytesseract
import face_recognition
import numpy as np
from pathlib import Path
from pdf2image import convert_from_path
from datetime import datetime

# Setup saving directories
SAVE_DIR = Path("extracted_data")
DOCS_DIR = SAVE_DIR / "documents"
FACES_DIR = SAVE_DIR / "faces"
for folder in [DOCS_DIR, FACES_DIR]:
    folder.mkdir(parents=True, exist_ok=True)

class KYCProcessor:
    def __init__(self):
        self.face_matching_threshold = 0.6 #

    def process_input(self, file_path):
        """Main entry point: handles PDF or Image"""
        ext = os.path.splitext(file_path)[1].lower()
        
        # Convert PDF to Image if necessary
        if ext == '.pdf':
            pages = convert_from_path(file_path)
            temp_img_path = str(DOCS_DIR / "temp_page.jpg")
            pages[0].save(temp_img_path, 'JPEG')
            image = cv2.imread(temp_img_path)
        else:
            image = cv2.imread(file_path)

        # 1. OCR Extraction
        text = pytesseract.image_to_string(image)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        text_file = DOCS_DIR / f"text_{timestamp}.txt"
        with open(text_file, "w") as f:
            f.write(text)

        # 2. Face Extraction & Saving
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_image)
        saved_faces = []

        for i, (top, right, bottom, left) in enumerate(face_locations):
            # Add small margin for better extraction
            face_img = image[max(0, top-20):bottom+20, max(0, left-20):right+20]
            face_filename = f"face_{timestamp}_{i}.jpg"
            face_path = FACES_DIR / face_filename
            cv2.imwrite(str(face_path), face_img)
            saved_faces.append(str(face_path))

        return {
            "text_preview": text[:100] + "...",
            "text_file": str(text_file),
            "extracted_faces": saved_faces,
            "status": "Success"
        }

    def match_faces(self, selfie_path, id_face_path):
        """Performs open-source face matching"""
        try:
            selfie = face_recognition.load_image_file(selfie_path)
            id_face = face_recognition.load_image_file(id_face_path)
            
            selfie_enc = face_recognition.face_encodings(selfie)[0]
            id_enc = face_recognition.face_encodings(id_face)[0]
            
            distance = face_recognition.face_distance([id_enc], selfie_enc)[0]
            confidence = round((1 - distance) * 100, 2)
            
            return {
                "match": bool(distance <= self.face_matching_threshold),
                "confidence": f"{confidence}%",
                "score": round(distance, 4)
            }
        except IndexError:
            return {"error": "Face not clearly visible in one or both images"}