import json
import operator
from collections import OrderedDict, defaultdict
from datetime import date

import boto3

users = (
    boto3.client("cognito-idp")
    .get_paginator("list_users")
    .paginate(
        UserPoolId="us-east-1_rdB8iu5X4",
        AttributesToGet=[],
    )
    .build_full_result()["Users"]
)


dynamodb = boto3.resource("dynamodb")
events_table = dynamodb.Table("moodtracker_events")

events_table_scan_response = events_table.scan(
    ExpressionAttributeNames={"#t": "type"},
    ProjectionExpression="createdAt,payload,#t,userId",
)
events = events_table_scan_response["Items"]
while "LastEvaluatedKey" in events_table_scan_response:
    events_table_scan_response = events_table.scan(
        ExclusiveStartKey=events_table_scan_response["LastEvaluatedKey"],
        ExpressionAttributeNames={"#t": "type"},
        ProjectionExpression="createdAt,payload,#t,userId",
    )
    events += events_table_scan_response["Items"]

events.sort(key=operator.itemgetter("createdAt"))

categories = {
    "meditations": OrderedDict(),
    "moods": OrderedDict(),
    "weights": OrderedDict(),
}
for event in events:
    event["created_at_date"] = date.fromisoformat(event["createdAt"][:10])
    _, category, operation = event["type"].split("/")

    if operation == "create":
        categories[category][event["createdAt"]] = event["payload"]
    if operation == "delete":
        del categories[category][event["payload"]]
    if operation == "update":
        categories[category][event["payload"]["id"]] = {
            **categories[category][event["payload"]["id"]],
            **event["payload"],
        }
        del categories[category][event["payload"]["id"]]["id"]


def compute_breakdown(get_key):
    results = {}

    for event in events:
        key = get_key(event["createdAt"])
        stats = results.get(key)
        if stats:
            stats["events"] += 1
            stats["userIds"].add(event["userId"])
        else:
            results[key] = {
                "events": 1,
                "meditations": [],
                "moods": [],
                "weights": [],
                "userIds": {event["userId"]},
            }

    for k, v in categories["meditations"].items():
        stats = results.get(get_key(k))
        stats["meditations"].append(int(v["seconds"]))

    for k, v in categories["moods"].items():
        stats = results.get(get_key(k))
        stats["moods"].append(int(v["mood"]))

    for k, v in categories["weights"].items():
        stats = results.get(get_key(k))
        stats["weights"].append(int(v["value"]))

    for k, v in results.items():
        event_counts = {}
        event_counts["meditations"] = len(v["meditations"])
        event_counts["moods"] = len(v["moods"])
        event_counts["weights"] = len(v["weights"])
        event_counts["total"] = v["events"]
        v["eventCounts"] = event_counts

        v["users"] = {}
        v["users"]["activeUserCount"] = len(v["userIds"])

        v["meditationMinutes"] = round(sum(v["meditations"]) / 60)

        del v["events"]
        del v["meditations"]
        del v["moods"]
        del v["userIds"]
        del v["weights"]

    return results


def get_iso_month_string(date_time_string):
    return date_time_string[0:7]


def get_iso_year_string(date_time_string):
    return date_time_string[0:4]


events_by_user_id = defaultdict(list)
for event in events:
    events_by_user_id[event["userId"]].append(event)

print(
    "Breakdown by month:", json.dumps(compute_breakdown(get_iso_month_string), indent=2)
)
print(
    "Breakdown by year:", json.dumps(compute_breakdown(get_iso_year_string), indent=2)
)
