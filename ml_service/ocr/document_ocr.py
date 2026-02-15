
import pytesseract
import cv2
import re
import numpy as np
from ..utils.image_processor import ImageProcessor

class DocumentOCR:
    def __init__(self, language='eng'):
        self.language = language
        self.image_processor = ImageProcessor()
        
        # Configure tesseract path (adjust for your system)
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Windows
        # pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'  # Linux
    
    def extract_text(self, image):
        """Extract text from document image"""
        # Preprocess image
        enhanced = self.image_processor.enhance_document_image(image)
        
        # Perform OCR
        custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        text = pytesseract.image_to_string(enhanced, config=custom_config, lang=self.language)
        
        return text.strip()
    
    def extract_structured_data(self, image):
        """Extract structured information from ID document"""
        text = self.extract_text(image)
        
        # Initialize result structure
        extracted_data = {
            'full_name': None,
            'date_of_birth': None,
            'document_number': None,
            'expiry_date': None,
            'address': None,
            'confidence_score': 0.0,
            'raw_text': text
        }
        
        # Extract using regex patterns (customize based on document type)
        # Example patterns for Aadhaar card (India)
        patterns = {
            'aadhaar_number': r'\d{4}\s?\d{4}\s?\d{4}',
            'name': r'(?<=Name:)(.*?)(?=\n|$)',
            'dob': r'\d{2}/\d{2}/\d{4}',
            'gender': r'(Male|Female|OTHER)',
        }
        
        # Simple extraction logic
        lines = text.split('\n')
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Check for name (usually first few lines)
            if i < 5 and len(line) > 3 and not any(c.isdigit() for c in line):
                if not extracted_data['full_name'] and len(line.split()) >= 2:
                    extracted_data['full_name'] = line
            
            # Check for date patterns
            date_match = re.search(r'\d{2}[/-]\d{2}[/-]\d{4}', line)
            if date_match and not extracted_data['date_of_birth']:
                extracted_data['date_of_birth'] = date_match.group()
            
            # Check for document number
            num_match = re.search(r'\d{4}[\s-]?\d{4}[\s-]?\d{4}', line)
            if num_match and not extracted_data['document_number']:
                extracted_data['document_number'] = num_match.group().replace(' ', '').replace('-', '')
        
        # Calculate confidence score based on extracted fields
        extracted_count = sum(1 for v in extracted_data.values() if v is not None)
        extracted_data['confidence_score'] = (extracted_count / 5) * 100
        
        return extracted_data