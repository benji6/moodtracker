import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime, timedelta, timezone

USER_POOL_ID = "us-east-1_rdB8iu5X4"

events_table = boto3.resource("dynamodb").Table("moodtracker_events")
cognito_idp_client = boto3.client("cognito-idp")

users_to_delete = [
    u
    for u in cognito_idp_client.get_paginator("list_users")
    .paginate(
        UserPoolId=USER_POOL_ID,
        AttributesToGet=[],
    )
    .build_full_result()["Users"]
    if u["UserLastModifiedDate"] < datetime.now(timezone.utc) - timedelta(365)
    and not events_table.query(
        KeyConditionExpression=Key("userId").eq(u["Username"]),
        Limit=1,
    )["Count"]
]
print("Users to delete:", users_to_delete)

if input('Type "yes" to proceed or anything else to abort: ') == "yes":
    print("Deleting users...")
    for user in users_to_delete:
        cognito_idp_client.admin_delete_user(
            UserPoolId=USER_POOL_ID, Username=user["Username"]
        )
        print("Deleted user ID: ", user["Username"])
else:
    print("Aborted")
