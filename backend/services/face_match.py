import os
from deepface import DeepFace

def run_face_match(id_card_path: str, selfie_path: str):
  
    try:
        # Use VGG-Face for speed on local machine
        result = DeepFace.verify(
            img1_path=id_card_path,
            img2_path=selfie_path,
            model_name="VGG-Face",
            enforce_detection=False
        )
        
        return {
            "match": result['verified'],
            "confidence": round((1 - result['distance']) * 100, 2),
            "error": None
        }
    except Exception as e:
        print(f"Face Match Error: {e}")
        return {"match": False, "confidence": 0.0, "error": str(e)}