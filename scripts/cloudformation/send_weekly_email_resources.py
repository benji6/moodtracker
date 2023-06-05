from troposphere import events, GetAtt, Ref, ses
from modules import lambda_function, lambda_role, lambda_permission


def send_weekly_email_resources(template):
    template.add_resource(
        events.Rule(
            "EventBusWeeklyEmailsRule",
            Name="EventBusWeeklyEmails",
            Description="Rule to trigger MoodTracker weekly emails",
            ScheduleExpression="cron(0 9 ? * MON *)",
            Targets=[
                events.Target(
                    Arn=GetAtt("LambdaWeeklyEmailsSend", "Arn"),
                    Id="LambdaWeeklyEmailsSend",
                )
            ],
        )
    )
    lambda_function(
        template,
        "LambdaWeeklyEmailsSend",
        code_filename="weekly_emails_send.py",
        FunctionName="MoodTrackerWeeklyEmailsSend",
        ReservedConcurrentExecutions=1,
        Role=GetAtt("LambdaWeeklyEmailsRole", "Arn"),
        Timeout=5,
    )
    lambda_permission(
        template,
        "LambdaWeeklyEmailsSendEventBusPermission",
        GetAtt("LambdaWeeklyEmailsSend", "Arn"),
        "events.amazonaws.com",
        GetAtt("EventBusWeeklyEmailsRule", "Arn"),
    )
    lambda_role(
        template,
        "LambdaWeeklyEmailsRole",
        "moodtracker_lambda_emails_send_policy",
        [
            {
                "Action": "cognito-idp:ListUsers",
                "Effect": "Allow",
                "Resource": GetAtt("CognitoUserPool", "Arn"),
            },
            {
                "Action": "dynamodb:Scan",
                "Effect": "Allow",
                "Resource": GetAtt("DynamoWeeklyEmailsTable", "Arn"),
            },
            {
                "Action": "ses:SendEmail",
                "Effect": "Allow",
                "Resource": Ref("SesNoreplyArn"),
            },
        ],
    )
