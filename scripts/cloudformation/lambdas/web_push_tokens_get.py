import json
from datetime import datetime, timedelta
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key

HEADERS = {"Content-Type": "application/json"}

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("moodtracker_web_push_tokens")


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    try:
        tokens = table.query(KeyConditionExpression=Key("userId").eq(user_id))["Items"]

        for t in tokens:
            del t["userId"]

        return {
            "body": json.dumps({"tokens": tokens}),
            "headers": HEADERS,
            "statusCode": 200,
        }
    except Exception as e:
        print("Exception", e)
        return {
            "body": json.dumps({"error": "Internal server error"}),
            "headers": HEADERS,
            "statusCode": 500,
        }
