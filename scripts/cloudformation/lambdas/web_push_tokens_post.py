import json
from datetime import datetime

import boto3

HEADERS = {"Content-Type": "application/json"}

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("moodtracker_web_push_tokens")


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    try:
        token = json.loads(event["body"])["token"]
    except json.JSONDecodeError as e:
        print("JSONDecodeError", e)
        return {
            "body": json.dumps({"error": "Malformed request body"}),
            "headers": HEADERS,
            "statusCode": 400,
        }
    except KeyError as e:
        print("KeyError", e)
        return {
            "body": json.dumps({"error": "Request body is missing `token` property"}),
            "headers": HEADERS,
            "statusCode": 400,
        }
    item = {
        "createdAt": datetime.utcnow().isoformat(),
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
