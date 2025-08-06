from flask import Flask, request, jsonify
import cv2
import numpy as np
import requests

app = Flask(__name__)

def analyze_face(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    ### 🔴 FIX REDNESS DETECTION ###
    lower_red = np.array([0, 70, 50])
    upper_red = np.array([10, 255, 255])
    mask1 = cv2.inRange(hsv, lower_red, upper_red)

    lower_red2 = np.array([170, 70, 50])
    upper_red2 = np.array([180, 255, 255])
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)

    redness_mask = mask1 + mask2
    redness_percentage = (np.sum(redness_mask > 0) / redness_mask.size) * 100

    ### 🟤 FIX ACNE DETECTION ###
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    acne_mask = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
    )

    kernel = np.ones((3, 3), np.uint8)
    acne_mask = cv2.morphologyEx(acne_mask, cv2.MORPH_OPEN, kernel)

    acne_percentage = (np.sum(acne_mask > 0) / acne_mask.size) * 100

    brightness = np.mean(gray)
    dullness = 100 - ((brightness / 255) * 100)

    return {
        "acne_percentage": round(acne_percentage, 2),
        "brightness": round(brightness, 2),
        "dullness": round(dullness, 2),
        "redness_percentage": round(redness_percentage, 2),
    }

@app.route("/analysis/analyze-face", methods=["POST"])
def analyze_face_api():
    data = request.get_json()
    if not data or "image_url" not in data:
        return jsonify({"error": "No image URL provided"}), 400

    image_url = data["image_url"]
    response = requests.get(image_url, stream=True)
    if response.status_code != 200:
        return jsonify({"error": "Failed to download image"}), 400

    npimg = np.frombuffer(response.content, np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if image is None:
        return jsonify({"error": "Invalid image"}), 400

    result = analyze_face(image)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
