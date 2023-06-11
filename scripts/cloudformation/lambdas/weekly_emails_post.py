import json
from datetime import datetime, timezone

import boto3

HEADERS = {"Content-Type": "application/json"}

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("moodtracker_weekly_emails")


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    try:
        table.put_item(
            Item={
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "userId": user_id,
            }
        )
        return {"statusCode": 204}
    except Exception as e:
        print(e)
        return {
            "body": json.dumps({"error": "Internal server error"}),
            "headers": HEADERS,
            "statusCode": 500,
        }
