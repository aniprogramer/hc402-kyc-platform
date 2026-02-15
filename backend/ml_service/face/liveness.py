import cv2
import numpy as np
import math
from imutils import face_utils

class LivenessDetector:
    def __init__(self):
        self.EYE_AR_THRESH = 0.25
        self.EYE_AR_CONSEC_FRAMES = 3
        self.blink_counter = 0
        self.blink_detected = False
    
    def eye_aspect_ratio(self, eye):
        """Calculate eye aspect ratio"""
        # Compute the euclidean distances between the vertical eye landmarks
        A = np.linalg.norm(eye[1] - eye[5])
        B = np.linalg.norm(eye[2] - eye[4])
        
        # Compute the euclidean distance between the horizontal eye landmarks
        C = np.linalg.norm(eye[0] - eye[3])
        
        # Compute the eye aspect ratio
        ear = (A + B) / (2.0 * C)
        return ear
    
    def detect_blink(self, landmarks):
        """Detect blink from facial landmarks"""
        # Get left and right eye landmarks
        left_eye = landmarks[42:48]
        right_eye = landmarks[36:42]
        
        # Calculate eye aspect ratio for both eyes
        left_ear = self.eye_aspect_ratio(left_eye)
        right_ear = self.eye_aspect_ratio(right_eye)
        
        # Average the eye aspect ratio
        ear = (left_ear + right_ear) / 2.0
        
        return ear < self.EYE_AR_THRESH
    
    def analyze_liveness_video(self, video_frames):
        """Analyze multiple frames for liveness detection"""
        if len(video_frames) < 5:
            return {
                'is_live': False,
                'confidence': 0,
                'message': 'Insufficient frames for liveness detection'
            }
        
        blink_detected = False
        movement_detected = False
        consistent_face = True
        
        # Track face position across frames
        prev_face_center = None
        movements = []
        
        for i, frame in enumerate(video_frames):
            # This would integrate with face detection
            # Simplified version - in production, use proper face detection
            
            # Simulate detection for demo
            if i % 3 == 0:  # Simulate blink every few frames
                blink_detected = True
        
        # Calculate confidence
        confidence = 0
        if blink_detected:
            confidence += 50
        if movement_detected:
            confidence += 30
        if consistent_face:
            confidence += 20
        
        is_live = confidence >= 70
        
        return {
            'is_live': is_live,
            'confidence': confidence,
            'blink_detected': blink_detected,
            'movement_detected': movement_detected,
            'message': 'Liveness verified' if is_live else 'Liveness check failed'
        }
    
    def check_head_movement(self, frames, landmarks_sequence):
        """Check for natural head movement"""
        if len(landmarks_sequence) < 2:
            return False
        
        # Calculate head pose changes
        movements = []
        for i in range(1, len(landmarks_sequence)):
            if landmarks_sequence[i] is not None and landmarks_sequence[i-1] is not None:
                # Calculate movement magnitude
                nose_tip_i = landmarks_sequence[i][30]  # Nose tip landmark
                nose_tip_prev = landmarks_sequence[i-1][30]
                
                movement = np.linalg.norm(nose_tip_i - nose_tip_prev)
                movements.append(movement)
        
        # Check if there's some movement but not too much (natural)
        if movements:
            avg_movement = np.mean(movements)
            return 2 < avg_movement < 20
        
        return False