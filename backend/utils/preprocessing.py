import re

from simplemma import lemmatize
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS


# Keep negation cues so "I do not feel sad" is not collapsed into "feel sad".
NEGATION_TOKENS = {"no", "not", "nor", "never"}
STOP_WORDS = set(ENGLISH_STOP_WORDS) - NEGATION_TOKENS


def preprocess_text(text: str) -> str:
    """Apply lowercase, alphabet filtering, stopword removal, and lemmatization."""
    if text is None:
        text = ""
    if not isinstance(text, str):
        text = str(text)

    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    if not text:
        return ""

    tokens = [token for token in text.split() if token not in STOP_WORDS]
    tokens = [lemmatize(token, lang="en") for token in tokens]
    return " ".join(tokens)
