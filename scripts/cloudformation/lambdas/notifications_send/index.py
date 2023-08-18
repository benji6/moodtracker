import boto3
from firebase_admin import credentials, initialize_app, messaging
import json


secrets_manager_client = boto3.client("secretsmanager")
private_key_json = json.loads(
    json.loads(
        secrets_manager_client.get_secret_value(
            SecretId="arn:aws:secretsmanager:us-east-1:315965384508:secret:MoodTrackerSecrets-MmgiN1"
        )["SecretString"]
    )["FirebaseServiceAccountPrivateKeyJson"]
)
initialize_app(credentials.Certificate(private_key_json))

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("moodtracker_web_push_tokens")


def handler(event, context):
    response = table.scan(
        ExpressionAttributeNames={"#t": "token"},
        ProjectionExpression="#t",
    )
    registration_tokens = [item["token"] for item in response["Items"]]
    while response.get("LastEvaluatedKey"):
        response = table.scan(
            ExclusiveStartKey=response["LastEvaluatedKey"],
            ExpressionAttributeNames={"#t": "token"},
            ProjectionExpression="#t",
        )
        registration_tokens.extend([item["token"] for item in response["Items"]])

    print("{0} tokens fetched".format(len(registration_tokens)))

    message = messaging.MulticastMessage(
        webpush=messaging.WebpushConfig(
            headers=None,
            data=None,
            fcm_options=messaging.WebpushFCMOptions("https://moodtracker.link/add"),
            notification=messaging.WebpushNotification(
                badge="https://moodtracker.link/icons/icon-without-css.svg",
                body="Add your mood today",
                icon="https://moodtracker.link/icons/icon-without-css.svg",
                language="en",
                require_interaction=True,
                title="Daily reminder",
            ),
        ),
        tokens=registration_tokens,
    )

    response = messaging.send_multicast(message)

    print("{0} messages were sent successfully".format(response.success_count))
    print("{0} messages failed to send".format(response.failure_count))

    if response.failure_count > 0:
        responses = response.responses
        failed_tokens = []
        for idx, resp in enumerate(responses):
            if not resp.success:
                # The order of responses corresponds to the order of the registration tokens.
                failed_tokens.append(registration_tokens[idx])
        print("List of tokens that caused failures: {0}".format(failed_tokens))
