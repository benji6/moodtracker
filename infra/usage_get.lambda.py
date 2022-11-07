import email
import json
import statistics
from datetime import datetime, timedelta, timezone

import boto3
from boto3.dynamodb.conditions import Attr

CACHE_KEY = "usage"
HEADERS = {"Content-Type": "application/json"}
SECONDS_PER_DAY = 86400
USER_POOL_ID = "us-east-1_rdB8iu5X4"

cache = {}

dynamodb = boto3.resource("dynamodb")
cache_table = dynamodb.Table("moodtracker_global_cache")
events_table = dynamodb.Table("moodtracker_events")
weekly_emails_table = dynamodb.Table("moodtracker_weekly_emails")


def handler(event, context):
    now = datetime.now(timezone.utc)
    days_ago_1 = now - timedelta(1)
    days_ago_7 = now - timedelta(7)
    days_ago_30 = now - timedelta(30)
    days_ago_60 = now - timedelta(60)
    days_ago_90 = now - timedelta(90)
    days_ago_365 = now - timedelta(365)
    consumed_capacity_units = 0
    db_cache_hit = False
    memory_cache_hit = False

    def log():
        print(
            {
                "consumedCapacityUnits": consumed_capacity_units,
                "dbCacheHit": db_cache_hit,
                "memoryCacheHit": memory_cache_hit,
            }
        )

    if "expires_at" in cache and now.timestamp() <= cache["expires_at"]:
        memory_cache_hit = True
        log()
        return cache["data"]

    try:
        cache_response = cache_table.get_item(Key={"key": CACHE_KEY})
        item = cache_response.get("Item")
        if item:
            db_cache_hit = True
            cache["expires_at"] = item["expiresAt"]
            cache["data"] = item["data"]
            log()
            return cache["data"]
    except Exception as e:
        print(e)

    events_filter_expression = Attr("createdAt").gt(days_ago_60.isoformat())

    try:
        users = (
            boto3.client("cognito-idp")
            .get_paginator("list_users")
            .paginate(
                UserPoolId=USER_POOL_ID,
                AttributesToGet=[],
            )
            .build_full_result()["Users"]
        )

        events_response = events_table.scan(
            ExpressionAttributeNames={"#t": "type"},
            FilterExpression=events_filter_expression,
            ProjectionExpression="createdAt,payload,#t,userId",
            ReturnConsumedCapacity="TOTAL",
        )
        events = events_response["Items"]
        consumed_capacity_units = events_response["ConsumedCapacity"]["CapacityUnits"]
        while "LastEvaluatedKey" in events_response:
            events_response = events_table.scan(
                ExclusiveStartKey=events_response["LastEvaluatedKey"],
                ExpressionAttributeNames={"#t": "type"},
                FilterExpression=events_filter_expression,
                ProjectionExpression="createdAt,payload,#t,userId",
                ReturnConsumedCapacity="TOTAL",
            )
            events += events_response["Items"]
            consumed_capacity_units += events_response["ConsumedCapacity"][
                "CapacityUnits"
            ]

    except Exception as e:
        print(e)
        return {
            "body": json.dumps({"error": "Internal server error"}),
            "headers": HEADERS,
            "statusCode": 500,
        }

    confirmed_users = [
        u for u in users if u["Enabled"] and u["UserStatus"] == "CONFIRMED"
    ]
    users_by_id = {u["Username"]: u for u in users}
    user_ids_in_current_30_day_window = set()
    user_ids_in_previous_30_day_window = set()
    meditation_MAU_ids = set()
    events_in_last_30_days = 0
    meditations = {}
    moods = {}
    weight_MAU_ids = set()
    for event in events:
        event["createdAt"] = datetime.fromisoformat(event["createdAt"][:-1]).replace(
            tzinfo=timezone.utc
        )
        if event["createdAt"] > days_ago_30:
            events_in_last_30_days += 1
            user_ids_in_current_30_day_window.add(event["userId"])

            if event["type"] == "v1/meditations/create":
                meditation_MAU_ids.add(event["userId"])
                meditations[event["createdAt"]] = event["payload"]
            elif event["type"] == "v1/meditations/delete":
                meditations.pop(event["payload"], None)

            elif event["type"] == "v1/weights/create":
                weight_MAU_ids.add(event["userId"])

            elif event["type"] == "v1/moods/create":
                moods[event["createdAt"]] = event["payload"]
            elif event["type"] == "v1/moods/delete":
                moods.pop(event["payload"], None)
            elif event["type"] == "v1/moods/update":
                if event["payload"]["id"] in moods:
                    moods[event["payload"]["id"]] = {
                        **moods[event["payload"]["id"]],
                        **event["payload"],
                    }
                    del moods[event["createdAt"]]["id"]
        else:
            user_ids_in_previous_30_day_window.add(event["userId"])

    meditation_seconds = 0
    for k, v in meditations.items():
        meditation_seconds += int(v["seconds"])

    mau_funnel = {
        "<7 days": 0,
        ">=7 & <30 days": 0,
        ">=30 & <60 days": 0,
        ">=60 & <90 days": 0,
        ">=90 & <365 days": 0,
        ">=365 days": 0,
    }
    for id in user_ids_in_current_30_day_window:
        create_date = users_by_id[id]["UserCreateDate"]
        if create_date > days_ago_7:
            mau_funnel["<7 days"] += 1
        elif create_date > days_ago_30:
            mau_funnel[">=7 & <30 days"] += 1
        elif create_date > days_ago_60:
            mau_funnel[">=30 & <60 days"] += 1
        elif create_date > days_ago_90:
            mau_funnel[">=60 & <90 days"] += 1
        elif create_date > days_ago_365:
            mau_funnel[">=90 & <365 days"] += 1
        else:
            mau_funnel[">=365 days"] += 1

    cache["expires_at"] = round(now.timestamp() + SECONDS_PER_DAY)
    cache["data"] = {
        "body": json.dumps(
            {
                "confirmedUsers": len(confirmed_users),
                "eventsInLast30Days": events_in_last_30_days,
                "meanMoodInLast30Days": round(
                    float(statistics.mean([v["mood"] for v in moods.values()])), 1
                ),
                "meanMoodInLast7Days": round(
                    float(
                        statistics.mean(
                            [v["mood"] for k, v in moods.items() if k > days_ago_7]
                        )
                    ),
                    1,
                ),
                "meditationMAUs": len(meditation_MAU_ids),
                "meditationSecondsInLast30Days": meditation_seconds,
                "newUsersInLast30Days": len(
                    [u for u in confirmed_users if u["UserCreateDate"] > days_ago_30]
                ),
                "usersWithWeeklyEmails": weekly_emails_table.item_count,
                "weightMAUs": len(weight_MAU_ids),
                "CRR": round(
                    1
                    - len(
                        user_ids_in_previous_30_day_window
                        - user_ids_in_current_30_day_window
                    )
                    / len(user_ids_in_previous_30_day_window),
                    3,
                ),
                "DAUs": len(
                    {
                        event["userId"]
                        for event in events
                        if event["createdAt"] > days_ago_1
                    }
                ),
                "MAUs": len(user_ids_in_current_30_day_window),
                "MAUFunnel": mau_funnel,
                "WAUs": len(
                    {
                        event["userId"]
                        for event in events
                        if event["createdAt"] > days_ago_7
                    }
                ),
            }
        ),
        "headers": {
            **HEADERS,
            "Cache-Control": "immutable",
            "Expires": email.utils.formatdate(cache["expires_at"], usegmt=True),
        },
        "statusCode": 200,
    }

    try:
        cache_table.put_item(
            Item={
                "key": CACHE_KEY,
                "data": cache["data"],
                "expiresAt": cache["expires_at"],
            }
        )
    except Exception as e:
        print(e)

    log()
    return cache["data"]
