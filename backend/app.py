from pathlib import Path

import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS

from utils.preprocessing import preprocess_text


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "model.pkl"
VECTORIZER_PATH = BASE_DIR / "models" / "tfidf.pkl"

CLASS_LABELS = {
    0: "Normal",
    1: "Anxiety",
    2: "Depression",
}

app = Flask(__name__)
CORS(app)

model = None
vectorizer = None


def load_artifacts() -> None:
    global model, vectorizer

    if not MODEL_PATH.exists() or not VECTORIZER_PATH.exists():
        model = None
        vectorizer = None
        return

    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)


load_artifacts()


@app.get("/")
def health() -> tuple[dict, int]:
    status = "ready" if model is not None and vectorizer is not None else "missing_model"
    return {"status": status}, 200


@app.post("/predict")
def predict() -> tuple[dict, int]:
    if model is None or vectorizer is None:
        return (
            {
                "error": "Model artifacts not found. Run: python train_model.py in backend folder first."
            },
            500,
        )

    payload = request.get_json(silent=True) or {}
    input_text = payload.get("text", "")

    if not input_text or not str(input_text).strip():
        return {"error": "Text input is required."}, 400

    cleaned = preprocess_text(str(input_text))
    features = vectorizer.transform([cleaned])

    class_id = int(model.predict(features)[0])
    prediction = CLASS_LABELS.get(class_id, "Unknown")

    response = {"prediction": prediction}

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(features)[0]
        max_confidence = float(max(probabilities))
        response["confidence"] = round(max_confidence, 4)

    return jsonify(response), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
