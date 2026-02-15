import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim
import imutils

class DocumentValidator:
    def __init__(self):
        self.min_document_area = 50000  # Minimum pixels for document area
        self.max_skew_angle = 10  # Maximum allowed skew angle
    
    def validate_document_image(self, image):
        """Validate document image quality and authenticity"""
        results = {
            'valid': True,
            'issues': [],
            'quality_score': 100,
            'warnings': []
        }
        
        # Check image dimensions
        h, w = image.shape[:2]
        if h < 300 or w < 400:
            results['valid'] = False
            results['issues'].append('Image too small')
            results['quality_score'] -= 30
        
        # Check for blur
        blur_score = self.check_blur(image)
        if blur_score < 50:
            results['valid'] = False
            results['issues'].append('Image too blurry')
            results['quality_score'] -= 40
        elif blur_score < 70:
            results['warnings'].append('Image slightly blurry')
            results['quality_score'] -= 15
        
        # Check brightness
        brightness_score = self.check_brightness(image)
        if brightness_score < 30 or brightness_score > 230:
            results['valid'] = False
            results['issues'].append('Poor lighting conditions')
            results['quality_score'] -= 30
        
        # Check for document edges
        has_edges, edge_score = self.detect_document_edges(image)
        if not has_edges:
            results['warnings'].append('Document edges not clearly visible')
            results['quality_score'] -= 20
        
        # Check for glare
        glare_detected, glare_score = self.detect_glare(image)
        if glare_detected:
            results['warnings'].append('Glare detected on document')
            results['quality_score'] -= 20
        
        results['quality_score'] = max(0, results['quality_score'])
        
        return results
    
    def check_blur(self, image):
        """Check image blur using Laplacian variance"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        variance = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        # Normalize to 0-100 scale
        normalized_variance = min(variance / 10, 100)
        return normalized_variance
    
    def check_brightness(self, image):
        """Check image brightness"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        mean_brightness = np.mean(gray)
        return mean_brightness
    
    def detect_document_edges(self, image):
        """Detect document edges using Canny edge detection"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply Canny edge detection
        edged = cv2.Canny(blurred, 75, 200)
        
        # Find contours
        contours, _ = cv2.findContours(edged, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        
        if len(contours) == 0:
            return False, 0
        
        # Find the largest contour
        largest_contour = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(largest_contour)
        
        # Check if area is reasonable for a document
        if area > self.min_document_area:
            return True, min(area / 1000, 100)
        
        return False, 0
    
    def detect_glare(self, image):
        """Detect glare/reflections on document"""
        # Convert to HSV color space
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Define range for bright white areas (potential glare)
        lower_white = np.array([0, 0, 200])
        upper_white = np.array([180, 30, 255])
        
        # Create mask for glare
        glare_mask = cv2.inRange(hsv, lower_white, upper_white)
        
        # Calculate percentage of glare pixels
        glare_percentage = (np.sum(glare_mask > 0) / glare_mask.size) * 100
        
        return glare_percentage > 5, glare_percentage
    
    def detect_tampering(self, original_image, submitted_image):
        """Detect potential tampering by comparing images"""
        # Resize images to same dimensions
        h, w = original_image.shape[:2]
        submitted_resized = cv2.resize(submitted_image, (w, h))
        
        # Convert to grayscale
        gray_original = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY)
        gray_submitted = cv2.cvtColor(submitted_resized, cv2.COLOR_BGR2GRAY)
        
        # Calculate SSIM
        similarity_index, diff = ssim(gray_original, gray_submitted, full=True)
        
        # If similarity is too low, potential tampering
        tampering_detected = similarity_index < 0.8
        
        return {
            'tampering_detected': tampering_detected,
            'similarity_score': similarity_index * 100,
            'message': 'Potential tampering detected' if tampering_detected else 'No tampering detected'
        }