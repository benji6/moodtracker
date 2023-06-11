import json
from datetime import datetime, timezone
import urllib.parse

import boto3

HEADERS = {"Content-Type": "application/json"}

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("moodtracker_web_push_tokens")


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    try:
        # checkov:skip=CKV_SECRET_6:False positive
        token = urllib.parse.unquote(event["pathParameters"]["token"])
    except KeyError as e:
        print("KeyError", e)
        return {
            "body": json.dumps({"error": "Token not provided"}),
            "headers": HEADERS,
            "statusCode": 400,
        }
    item = {
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "userId": user_id,
        "token": token,
    }
    try:
        table.put_item(Item=item)
        del item["userId"]
        return {
            "body": json.dumps(item),
            "headers": HEADERS,
            "statusCode": 201,
        }
    except Exception as e:
        print("Exception", e)
        return {
            "body": json.dumps({"error": "Internal server error"}),
            "headers": HEADERS,
            "statusCode": 500,
        }
