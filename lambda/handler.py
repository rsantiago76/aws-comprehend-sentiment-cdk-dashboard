import json
import boto3

comprehend = boto3.client("comprehend")

def handler(event, context):
    body_raw = event.get("body") or "{}"
    try:
        body = json.loads(body_raw)
    except Exception:
        return _resp(400, {"error": "invalid_json"})

    text = body.get("text")
    if not isinstance(text, str) or not text.strip():
        return _resp(400, {"error": "text is required"})

    result = comprehend.detect_sentiment(Text=text, LanguageCode="en")

    return _resp(200, {
        "sentiment": result["Sentiment"],
        "scores": result["SentimentScore"]
    })

def _resp(status, payload):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        "body": json.dumps(payload)
    }
