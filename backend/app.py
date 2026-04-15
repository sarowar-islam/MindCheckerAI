import os
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

POSITIVE_HINTS = {
    "happy",
    "calm",
    "balanced",
    "hopeful",
    "joy",
    "motivated",
    "refreshed",
    "connected",
    "stable",
}

NEGATIVE_HINTS = {
    "anxious",
    "nervous",
    "stressed",
    "sad",
    "hopeless",
    "overwhelmed",
    "lonely",
    "exhausted",
}

app = Flask(__name__)

allowed_origins_raw = os.getenv(
    "ALLOWED_ORIGINS",
    "https://mind-checker-ai.netlify.app,http://localhost:5173,http://127.0.0.1:5173",
)
ALLOWED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in allowed_origins_raw.split(",")
    if origin.strip()
]

CORS(
    app,
    resources={r"/*": {"origins": ALLOWED_ORIGINS}},
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

model = None
vectorizer = None


def infer_mood(prediction: str, confidence: float | None, cleaned_text: str) -> str:
    tokens = set(cleaned_text.split())
    positive_hits = len(tokens & POSITIVE_HINTS)
    negative_hits = len(tokens & NEGATIVE_HINTS)

    if prediction == "Normal":
        if positive_hits >= 2 and (confidence is None or confidence >= 0.4):
            return "Happy"
        if positive_hits >= 1 and negative_hits == 0:
            return "Happy"
        return "Stable"

    if prediction == "Anxiety":
        return "Anxious" if confidence is None or confidence >= 0.45 else "Mixed"

    if prediction == "Depression":
        return "Low Mood" if confidence is None or confidence >= 0.45 else "Mixed Low"

    return "Unclear"


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
def root() -> tuple[dict, int]:
    model_status = "ready" if model is not None and vectorizer is not None else "missing_model"
    return {
        "service": "mindcheck-ai-backend",
        "status": "ok",
        "model_status": model_status,
    }, 200


@app.get("/health")
def health() -> tuple[dict, int]:
    model_status = "ready" if model is not None and vectorizer is not None else "missing_model"
    return {
        "status": "ok",
        "model_status": model_status,
    }, 200


@app.get("/healthz")
def healthz() -> tuple[dict, int]:
    return {"status": "ok"}, 200


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
    confidence = None

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(features)[0]
        confidence = float(max(probabilities))
        response["confidence"] = round(confidence, 4)

        classes = getattr(model, "classes_", list(range(len(probabilities))))
        class_probabilities = {}
        for class_id, probability in zip(classes, probabilities):
            label = CLASS_LABELS.get(int(class_id), str(class_id))
            class_probabilities[label] = round(float(probability), 4)
        response["class_probabilities"] = class_probabilities

    response["mood"] = infer_mood(prediction, confidence, cleaned)

    return jsonify(response), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
