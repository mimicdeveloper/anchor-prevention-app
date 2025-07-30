from textblob import TextBlob

def analyze_sentiment(text: str) -> float:
    """
    Analyze the sentiment polarity of the given text.
    Returns a float between -1.0 (very negative) to 1.0 (very positive).
    """
    if not text:
        return 0.0  # Neutral if empty

    blob = TextBlob(text)
    return blob.sentiment.polarity
