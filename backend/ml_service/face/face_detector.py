import cv2
import numpy as np
import face_recognition
import dlib
from imutils import face_utils

class FaceDetector:
    def __init__(self):
        # Initialize face detector
        self.face_detector = dlib.get_frontal_face_detector()
        self.face_encoder = face_recognition
        
        # Load face landmark predictor
        try:
            self.landmark_predictor = dlib.shape_predictor(
                'models/shape_predictor_68_face_landmarks.dat'
            )
        except:
            print("Landmark predictor not found, using fallback")
            self.landmark_predictor = None
    
    def detect_faces(self, image):
        """Detect faces in image"""
        if len(image.shape) == 3 and image.shape[2] == 3:
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        else:
            rgb_image = image
        
        # Detect faces using dlib
        faces = self.face_detector(rgb_image, 1)
        
        face_locations = []
        for face in faces:
            x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
            face_locations.append({
                'bbox': [x1, y1, x2, y2],
                'confidence': 1.0,
                'landmarks': self.get_landmarks(rgb_image, face) if self.landmark_predictor else None
            })
        
        return face_locations
    
    def get_face_embedding(self, face_image):
        """Generate face embedding using face_recognition"""
        if face_image.size == 0:
            return None
        
        try:
            # Convert to RGB if needed
            if len(face_image.shape) == 3 and face_image.shape[2] == 3:
                rgb_face = cv2.cvtColor(face_image, cv2.COLOR_BGR2RGB)
            else:
                rgb_face = face_image
            
            # Get face encoding
            encodings = face_recognition.face_encodings(rgb_face)
            
            if len(encodings) > 0:
                return encodings[0]
            return None
        except Exception as e:
            print(f"Error getting face embedding: {e}")
            return None
    
    def get_landmarks(self, image, face):
        """Extract facial landmarks"""
        if self.landmark_predictor:
            landmarks = self.landmark_predictor(image, face)
            return face_utils.shape_to_np(landmarks)
        return None
    
    def extract_face(self, image, bbox, margin=20):
        """Extract face region from image"""
        h, w = image.shape[:2]
        x1, y1, x2, y2 = bbox
        
        # Add margin
        x1 = max(0, x1 - margin)
        y1 = max(0, y1 - margin)
        x2 = min(w, x2 + margin)
        y2 = min(h, y2 + margin)
        
        face_region = image[y1:y2, x1:x2]
        return face_region