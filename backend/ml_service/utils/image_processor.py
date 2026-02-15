import cv2
import numpy as np
from PIL import Image
import base64
import io
import imutils

class ImageProcessor:
    @staticmethod
    def base64_to_image(base64_string):
        """Convert base64 string to OpenCV image"""
        if 'data:image' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        img_data = base64.b64decode(base64_string)
        img_array = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        return img
    
    @staticmethod
    def image_to_base64(image, format='.jpg'):
        """Convert OpenCV image to base64 string"""
        _, buffer = cv2.imencode(format, image)
        return base64.b64encode(buffer).decode('utf-8')
    
    @staticmethod
    def preprocess_image(image, target_size=(224, 224)):
        """Preprocess image for model input"""
        if len(image.shape) == 3:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        image = cv2.resize(image, target_size)
        image = image.astype('float32') / 255.0
        return image
    
    @staticmethod
    def enhance_document_image(image):
        """Enhance document image for better OCR"""
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Apply adaptive thresholding
        enhanced = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 11, 2
        )
        
        # Noise removal
        enhanced = cv2.medianBlur(enhanced, 3)
        
        return enhanced
    
    @staticmethod
    def detect_blur(image, threshold=100):
        """Detect if image is blurry using Laplacian variance"""
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        variance = cv2.Laplacian(gray, cv2.CV_64F).var()
        return variance < threshold, variance