import easyocr

# Initialize reader once (gpu=False for compatibility)
reader = easyocr.Reader(['en'], gpu=False) 

def run_ocr(image_path: str):
    """
    Extracts text from the ID card image.
    """
    try:
        results = reader.readtext(image_path, detail=0)
        full_text = " ".join(results).lower()
        
        return {
            "success": True,
            "text": full_text
        }
    except Exception as e:
        print(f"OCR Error: {e}")
        return {"success": False, "text": ""}