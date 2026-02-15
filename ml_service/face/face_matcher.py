import numpy as np
from scipy.spatial.distance import cosine
from .face_detector import FaceDetector
import cv2

class FaceMatcher:
    def __init__(self, threshold=0.6):
        self.threshold = threshold
        self.detector = FaceDetector()
    
    def match_faces(self, selfie_image, document_image):
        """Compare selfie with document photo"""
        # Detect faces in both images
        selfie_faces = self.detector.detect_faces(selfie_image)
        doc_faces = self.detector.detect_faces(document_image)
        
        if len(selfie_faces) == 0 or len(doc_faces) == 0:
            return {
                'match': False,
                'confidence': 0,
                'message': 'No face detected in one or both images'
            }
        
        # Get main face from each
        selfie_face = selfie_faces[0]
        doc_face = doc_faces[0]
        
        # Extract face regions
        selfie_face_img = self.detector.extract_face(
            selfie_image, selfie_face['bbox']
        )
        doc_face_img = self.detector.extract_face(
            document_image, doc_face['bbox']
        )
        
        # Get embeddings
        selfie_embedding = self.detector.get_face_embedding(selfie_face_img)
        doc_embedding = self.detector.get_face_embedding(doc_face_img)
        
        if selfie_embedding is None or doc_embedding is None:
            return {
                'match': False,
                'confidence': 0,
                'message': 'Could not generate face embeddings'
            }
        
        # Calculate similarity
        distance = cosine(selfie_embedding, doc_embedding)
        similarity = 1 - distance
        
        # Normalize to 0-100
        confidence_score = similarity * 100
        
        is_match = confidence_score > (self.threshold * 100)
        
        return {
            'match': is_match,
            'confidence': round(confidence_score, 2),
            'distance': round(distance, 4),
            'message': 'Face match successful' if is_match else 'Face match failed',
            'faces_detected': {
                'selfie': len(selfie_faces),
                'document': len(doc_faces)
            }
        }
    
    def verify_multiple_faces(self, images):
        """Verify if all images contain the same person"""
        if len(images) < 2:
            return {'verified': False, 'message': 'Need at least 2 images'}
        
        embeddings = []
        for img in images:
            faces = self.detector.detect_faces(img)
            if len(faces) > 0:
                face_img = self.detector.extract_face(img, faces[0]['bbox'])
                embedding = self.detector.get_face_embedding(face_img)
                if embedding is not None:
                    embeddings.append(embedding)
        
        if len(embeddings) < 2:
            return {'verified': False, 'message': 'Could not detect faces in all images'}
        
        # Compare all pairs
        all_match = True
        similarities = []
        
        for i in range(len(embeddings)):
            for j in range(i+1, len(embeddings)):
                distance = cosine(embeddings[i], embeddings[j])
                similarity = (1 - distance) * 100
                similarities.append(similarity)
                
                if similarity < (self.threshold * 100):
                    all_match = False
        
        avg_similarity = np.mean(similarities) if similarities else 0
        
        return {
            'verified': all_match,
            'average_confidence': round(avg_similarity, 2),
            'pairwise_similarities': [round(s, 2) for s in similarities],
            'message': 'All faces match' if all_match else 'Face mismatch detected'
        }