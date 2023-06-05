# NOTE: This will not scale beyond a certain number of
# subscriptions as lambda excution is time-bound

from datetime import datetime, timedelta

import boto3

today = datetime.utcnow().date()
last_monday = today - timedelta(days=today.weekday() + 7)
last_monday_iso = last_monday.isoformat()

BODY = {
    "Text": {
        "Data": f"""Good morning from MoodTracker!

Your weekly report is now complete and ready to view, just click the following link https://moodtracker.link/stats/weeks/{last_monday_iso}!

We hope you have a lovely day 🙂

(You're receiving this email because you signed up for MoodTracker weekly email updates. If you no longer want these updates you can turn them off on your notifications settings page https://moodtracker.link/settings/notifications.)""",
        "Charset": "UTF-8",
    },
    "Html": {
        "Data": f"""<!DOCTYPE html>
<html>
  <head>
    <style>
      .button:hover, .button:focus {{
        background-color: #024b94 !important;
      }}
      .button:active {{
        background-color: #00284f !important;
      }}
      .link:hover, .link:focus {{
        color: #024b94 !important;
        text-decoration: none !important;
      }}
    </style>
  </head>
  <body>
    <p style="font-size: 1.25em">Good morning from MoodTracker!</p>
    <p style="font-size: 1.25em">Your weekly report is now complete and ready to view, just click the link below:</p>
    <p>
      <a class="button" href="https://moodtracker.link/stats/weeks/{last_monday_iso}" style="background-color: #003870; border-radius: 0.66667em; font-size: 1.5em; margin: 0.5em 0; padding: 0.75em 1em; display: inline-block; font-weight: bold; text-decoration: none; color: #eff2f5;">Check out your weekly report!</a>
    </p>
    <p style="font-size: 1.25em">
      We hope you have a lovely day 🙂
    </p>
    <p>
      <small>
        You're receiving this email because you signed up for MoodTracker weekly email updates. If you no longer wish to receive these updates you can turn them off on your <a class="link" href="https://moodtracker.link/settings/notifications" style="color: #003870;">notification settings page</a>.
      </small>
    </p>
  </body>
</html>""",
        "Charset": "UTF-8",
    },
}
PROJECTION_EXPRESSION = "userId"
USER_POOL_ID = "us-east-1_rdB8iu5X4"

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("moodtracker_weekly_emails")
cognito_client = boto3.client("cognito-idp")
ses_client = boto3.client("sesv2")


def send_email(user_id):
    list_users_response = cognito_client.list_users(
        UserPoolId=USER_POOL_ID,
        AttributesToGet=["email"],
        Limit=1,
        Filter=f'sub = "{user_id}"',
    )
    users = list_users_response["Users"]

    if not len(users):
        raise ValueError(f'Could not find user with id "{user_id}"')

    email_address = users[0]["Attributes"][0]["Value"]

    ses_client.send_email(
        FromEmailAddress='"MoodTracker" <noreply@moodtracker.link>',
        FromEmailAddressIdentityArn="arn:aws:ses:us-east-1:315965384508:identity/noreply@moodtracker.link",
        Destination={"ToAddresses": [email_address]},
        Content={
            "Simple": {
                "Subject": {
                    "Data": "Your weekly report from MoodTracker!",
                    "Charset": "UTF-8",
                },
                "Body": BODY,
            },
        },
    )


def send_emails(scan_response):
    for item in scan_response["Items"]:
        try:
            send_email(item["userId"])
        except Exception as e:
            print(e)


def handler(event, context):
    print("Table scan")
    response = table.scan(ProjectionExpression=PROJECTION_EXPRESSION)
    print("Send emails")
    send_emails(response)
    last_evaluated_key = response.get("LastEvaluatedKey")

    while last_evaluated_key:
        print("Table scan")
        response = table.scan(
            ExclusiveStartKey=last_evaluated_key,
            ProjectionExpression=PROJECTION_EXPRESSION,
        )
        print("Send emails")
        send_emails(response)
        last_evaluated_key = response.get("LastEvaluatedKey")
