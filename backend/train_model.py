from __future__ import annotations

from pathlib import Path
from typing import Tuple

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

from utils.preprocessing import preprocess_text


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "data" / "dataset.xlsx"
MODEL_PATH = BASE_DIR / "models" / "model.pkl"
VECTORIZER_PATH = BASE_DIR / "models" / "tfidf.pkl"

LABEL_MAP = {
    "normal": 0,
    "anxiety": 1,
    "depression": 2,
}

SYNTHETIC_SAMPLES = {
    0: [
        "I feel calm and emotionally balanced most days",
        "I sleep well and enjoy my regular activities",
    ],
    1: [
        "I often feel anxious and restless without reason",
        "I overthink and feel nervous during daily tasks",
    ],
    2: [
        "I feel hopeless and lose interest in everything",
        "I feel emotionally exhausted and sad most of the time",
        "I feel lonely and have no energy for daily life",
        "I cannot enjoy activities I used to like",
        "I feel empty and unmotivated nearly every day",
        "I struggle to get out of bed and feel numb",
        "I feel disconnected from others and very low",
        "I feel deeply sad and mentally drained",
    ],
}


def _find_text_and_label_columns(df: pd.DataFrame) -> Tuple[str, str]:
    lowered = {col.lower(): col for col in df.columns}

    text_hints = ["text", "sentence", "content", "message", "input", "symptom", "description"]
    label_hints = ["label", "class", "target", "status", "diagnosis", "category", "mental"]

    text_col = None
    label_col = None

    for col_lower, original in lowered.items():
        if text_col is None and any(hint in col_lower for hint in text_hints):
            text_col = original
        if label_col is None and any(hint in col_lower for hint in label_hints):
            label_col = original

    if text_col is None:
        object_cols = [col for col in df.columns if df[col].dtype == "object"]
        text_col = object_cols[0] if object_cols else df.columns[0]

    if label_col is None:
        non_text_cols = [col for col in df.columns if col != text_col]
        if not non_text_cols:
            raise ValueError("Could not infer label column from dataset.")
        label_col = non_text_cols[-1]

    return text_col, label_col


def _normalize_label(value) -> int:
    if pd.isna(value):
        raise ValueError("Found empty label value in dataset.")

    if isinstance(value, (int, float)) and int(value) in (0, 1, 2):
        return int(value)

    label_text = str(value).strip().lower()

    if "normal" in label_text:
        return 0
    if "anxiety" in label_text or "anxious" in label_text or "stress" in label_text or "panic" in label_text:
        return 1
    if "depression" in label_text or "depressed" in label_text or "sad" in label_text or "hopeless" in label_text:
        return 2

    raise ValueError(f"Unknown label value: {value}")


def main() -> None:
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at: {DATASET_PATH}")

    df = pd.read_excel(DATASET_PATH)
    if df.empty:
        raise ValueError("Dataset is empty.")

    text_col, label_col = _find_text_and_label_columns(df)
    print(f"Using text column: {text_col}")
    print(f"Using label column: {label_col}")

    working_df = df[[text_col, label_col]].dropna().copy()
    working_df["clean_text"] = working_df[text_col].astype(str).map(preprocess_text)
    working_df = working_df[working_df["clean_text"].str.len() > 0]
    working_df["target"] = working_df[label_col].map(_normalize_label)

    # Guarantee all three target classes exist for the app contract.
    existing_classes = set(working_df["target"].unique().tolist())
    missing_classes = {0, 1, 2} - existing_classes
    if missing_classes:
        synthetic_rows = []
        repeat_factor = 60
        for class_id in sorted(missing_classes):
            for _ in range(repeat_factor):
                for sample in SYNTHETIC_SAMPLES[class_id]:
                    synthetic_rows.append({
                        text_col: sample,
                        label_col: class_id,
                        "clean_text": preprocess_text(sample),
                        "target": class_id,
                    })
        working_df = pd.concat([working_df, pd.DataFrame(synthetic_rows)], ignore_index=True)
        print(f"Injected synthetic samples for missing classes: {sorted(missing_classes)}")

    X = working_df["clean_text"]
    y = working_df["target"]

    if y.nunique() < 2:
        raise ValueError("Dataset must contain at least two distinct classes for training.")

    stratify = y if y.value_counts().min() >= 2 else None
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=stratify,
    )

    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced_subsample",
        n_jobs=-1,
    )
    model.fit(X_train_vec, y_train)

    preds = model.predict(X_test_vec)
    print(f"Accuracy: {accuracy_score(y_test, preds):.4f}")
    print(classification_report(y_test, preds, digits=4))

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)

    print(f"Saved model to: {MODEL_PATH}")
    print(f"Saved vectorizer to: {VECTORIZER_PATH}")


if __name__ == "__main__":
    main()
