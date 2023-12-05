from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from io import BytesIO
import base64
import numpy as np
import face_recognition

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def base64_to_image(base64_string):
    try:
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data))
        return image
    except Exception as e:
        print(f"Error decoding base64 string: {e}")
        return None

def compare_images(image1_base64, image2_base64):
    image1 = base64_to_image(image1_base64)
    image2 = base64_to_image(image2_base64)

    if image1 is None or image2 is None:
        return {"match_flag": 0, "message": "Error decoding images"}

    face_enc1 = face_recognition.face_encodings(np.array(image1))
    face_enc2 = face_recognition.face_encodings(np.array(image2))

    if not face_enc1 or not face_enc2:
        return {"match_flag": 0, "message": "Error finding face encodings"}

    is_same = face_recognition.compare_faces([face_enc1[0]], face_enc2[0])[0]

    if is_same:
        distance = face_recognition.face_distance([face_enc1[0]], face_enc2[0])
        distance = round(distance[0] * 100)
        accuracy = 100 - round(distance)
        return {"match_flag": 1, "message": f"The images are the same. Accuracy Level: {accuracy}%"}
    else:
        return {"match_flag": 0, "message": "The images are not the same"}

@app.route('/compare', methods=['POST'])
def handle_compare_request():
    try:
        image1_base64 = request.form.get('image1', '')
        image2_base64 = request.form.get('image2', '')
        print('image1-----',image1_base64)
        print('image2-----',image2_base64)
        result = compare_images(image1_base64, image2_base64)

        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"match_flag": 0, "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
