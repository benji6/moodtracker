import json
import urllib.parse

import boto3

HEADERS = {"Content-Type": "application/json"}

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("moodtracker_web_push_tokens")


def create_error_response(error_string):
    return {
        "body": json.dumps({"error": error_string}),
        "headers": HEADERS,
        "statusCode": 400,
    }


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    try:
        # checkov:skip=CKV_SECRET_6:Rule not valid
        token = urllib.parse.unquote(event["pathParameters"]["token"])
    except KeyError as e:
        return create_error_response("Token not provided")
    try:
        item = json.loads(event["body"])
    except json.decoder.JSONDecodeError as e:
        return create_error_response("Invalid JSON in request body")
    if type(item.get("createdAt")) != str:
        return create_error_response("Missing/invalid `createdAt` in request body")
    if type(item.get("updatedAt")) != str:
        return create_error_response("Missing/invalid `updatedAt` in request body")
    if len([*item]) != 2:
        return create_error_response("Invalid number of keys in request body")

    item["token"] = token
    item["userId"] = user_id
    try:
        table.put_item(Item=item)
        return {"headers": HEADERS, "statusCode": 201}
    except Exception as e:
        print("Exception", e)
        return {
            "body": json.dumps({"error": "Internal server error"}),
            "headers": HEADERS,
            "statusCode": 500,
        }
