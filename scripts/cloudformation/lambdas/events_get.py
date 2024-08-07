import json
from datetime import datetime, timedelta
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key

HEADERS = {"Content-Type": "application/json"}

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("moodtracker_events")


def log_error(error, user_id):
    print({"error": error, "userId": user_id})


def handler(event, context):
    cursor_date = None
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    try:
        if event["queryStringParameters"] and event["queryStringParameters"]["cursor"]:
            try:
                cursor_date = datetime.fromisoformat(
                    event["queryStringParameters"]["cursor"]
                )
            except ValueError as e:
                log_error(e, user_id)
                return {
                    "body": json.dumps(
                        {"error": 'Invalid "cursor" query string parameter'}
                    ),
                    "headers": HEADERS,
                    "statusCode": 400,
                }

        key_condition_expression = Key("userId").eq(user_id)
        if cursor_date:
            # Defend against pathological clock skew
            cursor_date_str = (cursor_date - timedelta(minutes=30)).isoformat()
            key_condition_expression = key_condition_expression & Key(
                "serverCreatedAt"
            ).gt(cursor_date_str)

        response = table.query(
            ExpressionAttributeNames={"#t": "type"},
            IndexName="serverCreatedAt",
            KeyConditionExpression=key_condition_expression,
            # Limit is set to ensure the lambda does not time out
            # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb/table/query.html "if the processed dataset size exceeds 1 MB before DynamoDB reaches this limit,
            # it stops the operation and returns the matching values up to the limit,
            # and a key in LastEvaluatedKey to apply in a subsequent operation to continue the operation"
            # Note that API GW payload limit is 10 MB https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html
            # and Lambda payload limit is 6 MB https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
            # In testing it takes about 1 second to fetch 1000 events,
            # this could vary greatly given events can have very different sizes,
            # therefore the Lambda timeout is set to a conservative 5 seconds.
            Limit=1000,
            ProjectionExpression="createdAt,payload,serverCreatedAt,#t",
        )

        events = response["Items"]
        has_next_page = "LastEvaluatedKey" in response

        last_server_created_at = None
        for event in events:
            if last_server_created_at == None:
                last_server_created_at = event["serverCreatedAt"]
            elif last_server_created_at < event["serverCreatedAt"]:
                last_server_created_at = event["serverCreatedAt"]
            del event["serverCreatedAt"]
            payload = event["payload"]
            if isinstance(payload, dict):
                if "location" in payload:
                    payload["location"] = {
                        k: float(v) if isinstance(v, Decimal) else v
                        for k, v in payload["location"].items()
                    }
                if isinstance(payload.get("seconds"), Decimal):
                    payload["seconds"] = int(payload["seconds"])
                for k, v in payload.items():
                    if isinstance(v, Decimal):
                        payload[k] = float(v)
        return {
            "body": json.dumps(
                {
                    "events": events,
                    "hasNextPage": has_next_page,
                    "nextCursor": last_server_created_at,
                }
            ),
            "headers": HEADERS,
            "statusCode": 200,
        }
    except Exception as e:
        log_error(e, user_id)
        return {
            "body": json.dumps({"error": "Internal server error"}),
            "headers": HEADERS,
            "statusCode": 500,
        }
