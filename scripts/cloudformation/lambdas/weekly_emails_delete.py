import json

import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("moodtracker_weekly_emails")


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    try:
        table.delete_item(Key={"userId": user_id})
        return {"statusCode": 204}
    except Exception as e:
        print(e)
        return {
            "body": json.dumps({"error": "Internal server error"}),
            "headers": {"Content-Type": "application/json"},
            "statusCode": 500,
        }
