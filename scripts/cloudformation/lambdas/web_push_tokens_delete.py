import json
import urllib.parse

import boto3


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

    try:
        table.delete_item(Key={"userId": user_id, "token": token})
        return {"statusCode": 204}
    except Exception as e:
        print(e)
        return {
            "body": json.dumps({"error": "Internal server error"}),
            "headers": {"Content-Type": "application/json"},
            "statusCode": 500,
        }
