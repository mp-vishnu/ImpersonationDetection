from flask import Flask, jsonify, request
from flask_cors import CORS
import base64
import numpy as np
import cv2
import face_recognition

app = Flask(__name__)
CORS(app)

# Assume that the face encoding is not initially available
stored_encoding = None

def capture_image():
    # This function is not needed for static image comparison
    pass

@app.route('/')
def index():
    return "Welcome to Face Recognition App"

@app.route("/compare", methods=['POST'])
def compare():
    global stored_encoding

    try:
        # Load the image data from the request body
        req_data = request.get_json()
        image_data = req_data.get('image1')
        image2_data = req_data.get('image2')

        # Convert the base64 image data to a numpy array
        image_np = np.frombuffer(base64.b64decode(image_data), np.uint8)
        image2_np = np.frombuffer(base64.b64decode(image2_data), np.uint8)

        # Decode the images using OpenCV
        captured_frame = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        captured_frame2 = cv2.imdecode(image2_np, cv2.IMREAD_COLOR)

        # Resize the frames for face recognition
        small_frame = cv2.resize(captured_frame, (0, 0), fx=0.25, fy=0.25)
        small_frame2 = cv2.resize(captured_frame2, (0, 0), fx=0.25, fy=0.25)

        rgb_small_frame = small_frame[:, :, ::-1]
        rgb_small_frame2 = small_frame2[:, :, ::-1]

        # Find face locations and encodings for the first image
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        if not face_encodings:
            return jsonify({"message": "No face found in the first captured image", "match_flag": False})

        # If the stored face encoding is not available, save the current one
        if stored_encoding is None:
            stored_encoding = face_encodings[0]

        # Compare with the stored face encoding
        matches = face_recognition.compare_faces([stored_encoding], face_encodings[0])
        if not matches[0]:
            return jsonify({"message": "no match with the first image", "match_flag": False})

        # Find face locations and encodings for the second image
        face_locations2 = face_recognition.face_locations(rgb_small_frame2)
        face_encodings2 = face_recognition.face_encodings(rgb_small_frame2, face_locations2)

        if not face_encodings2:
            return jsonify({"message": "No face found in the second captured image", "match_flag": False})

        # Compare with the stored face encoding
        matches2 = face_recognition.compare_faces([stored_encoding], face_encodings2[0])
        if matches2[0]:
            return jsonify({"message": "match with the second image", "match_flag": True})
        else:
            return jsonify({"message": "no match with the second image", "match_flag": False})

    except Exception as e:
        return jsonify({"error": str(e), "match_flag": False})

if __name__ == '__main__':
    app.run(debug=True)
