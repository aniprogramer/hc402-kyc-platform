import requests
import os
import tempfile
from pdf2image import convert_from_path
import mimetypes

BASE_URL = "http://localhost:8001"
# This can now be a .pdf, .jpg, .png, or .jpeg
FILE_PATH = "/Users/ashish/Desktop/hc402-kyc-platform/WhatsApp Image 2026-02-15 at 13.37.49.jpeg" 

def test_kyc():
    print(f"🚀 Connecting to ML Service at {BASE_URL}...")
    
    if not os.path.exists(FILE_PATH):
        print(f"❌ File not found: {FILE_PATH}")
        return
    
    file_ext = os.path.splitext(FILE_PATH)[1].lower()
    temp_img_path = None

    try:
        # 1. Handle PDF vs Image logic
        if file_ext == '.pdf':
            print("🔄 Converting PDF to image...")
            images = convert_from_path(FILE_PATH, dpi=300)
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
                images[0].save(tmp.name, 'JPEG')
                temp_img_path = tmp.name
        else:
            print(f"🖼️  Detected image format ({file_ext}), sending directly...")
            temp_img_path = FILE_PATH

        # 2. Send to Server
        print("📤 Sending to /process-document...")
        with open(temp_img_path, "rb") as f:
            # Determine mime type automatically
            mime_type = mimetypes.guess_type(temp_img_path)[0] or 'image/jpeg'
            files = {'file': (os.path.basename(temp_img_path), f, mime_type)}
            response = requests.post(f"{BASE_URL}/process-document", files=files)
        
        # Only delete if it was a temporary converted PDF
        if file_ext == '.pdf' and temp_img_path:
            os.unlink(temp_img_path)
        
        if response.status_code == 200:
            res = response.json()
            kyc_info = res.get('data', {}) 
            
            print("\n✅ EXTRACTION SUCCESS")
            print("=" * 40)
            print(f"👤 Identity: {res.get('identified_as')}")
            print(f"📁 Folder: {res.get('folder')}")
            print(f"📄 Doc Type: {res.get('document_detected')}")
            print("=" * 40)
        else:
            print(f"❌ Server Error {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ Error during test: {e}")

if __name__ == "__main__":
    test_kyc()