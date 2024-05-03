from troposphere import events, GetAtt
from modules import awslambda, lambda_role, lambda_permission
from constants import CLOUDFORMATION_BUCKET_NAME


def send_web_notifications_resources(template):
    template.add_resource(
        events.Rule(
            "EventBusWebNotificationsRule",
            Name="EventBusWebNotifications",
            Description="Rule to trigger MoodTracker daily web notifications",
            ScheduleExpression="cron(0 12 * * ? *)",
            Targets=[
                events.Target(
                    Arn=GetAtt("LambdaWebNotificationsSend", "Arn"),
                    Id="LambdaWebNotificationsSend",
                )
            ],
        )
    )
    template.add_resource(
        awslambda.Function(
            "LambdaWebNotificationsSend",
            Code=awslambda.Code(
                S3Bucket=CLOUDFORMATION_BUCKET_NAME,
                S3Key="lambdas/notifications_send.zip",
            ),
            FunctionName="MoodTrackerWebNotificationsSend",
            Handler="index.handler",
            Runtime="python3.12",
            ReservedConcurrentExecutions=1,
            Role=GetAtt("LambdaNotificationsSendRole", "Arn"),
            Timeout=12,
        )
    )
    lambda_role(
        template,
        "LambdaNotificationsSendRole",
        "moodtracker_lambda_notifications_send_policy",
        [
            {
                "Action": ["dynamodb:DeleteItem", "dynamodb:Scan"],
                "Effect": "Allow",
                "Resource": GetAtt("DynamoWebPushTokensTable", "Arn"),
            },
            {
                "Action": "secretsmanager:GetSecretValue",
                "Effect": "Allow",
                "Resource": "arn:aws:secretsmanager:us-east-1:315965384508:secret:MoodTrackerSecrets-MmgiN1",
            },
        ],
    )
    lambda_permission(
        template,
        "LambdaWebNotificationsSendEventBusPermission",
        GetAtt("LambdaWebNotificationsSend", "Arn"),
        "events.amazonaws.com",
        GetAtt("EventBusWebNotificationsRule", "Arn"),
    )
