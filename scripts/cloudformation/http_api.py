from troposphere import GetAtt, Sub
from modules import lambda_endpoint
import troposphere.awslambda as awslambda


def http_api(template):
    lambda_endpoint(
        template,
        "events",
        "GET",
        {
            "Action": "dynamodb:Query",
            "Effect": "Allow",
            "Resource": [
                GetAtt("DynamoEventsTable", "Arn"),
                Sub("${DynamoEventsTable.Arn}/index/serverCreatedAt"),
            ],
        },
    )
    lambda_endpoint(
        template,
        "events",
        "POST",
        {
            "Action": "dynamodb:BatchWriteItem",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoEventsTable", "Arn"),
        },
    )
    lambda_endpoint(
        template,
        "usage",
        "GET",
        authorization=False,
        statement=[
            {
                "Action": "cognito-idp:ListUsers",
                "Effect": "Allow",
                "Resource": GetAtt("CognitoUserPool", "Arn"),
            },
            {
                "Action": "dynamodb:DescribeTable",
                "Effect": "Allow",
                "Resource": GetAtt("DynamoWeeklyEmailsTable", "Arn"),
            },
            {
                "Action": ["dynamodb:GetItem", "dynamodb:PutItem"],
                "Effect": "Allow",
                "Resource": GetAtt("DynamoGlobalCacheTable", "Arn"),
            },
            {
                "Action": "dynamodb:Scan",
                "Effect": "Allow",
                "Resource": GetAtt("DynamoEventsTable", "Arn"),
            },
        ],
    )
    lambda_endpoint(
        template,
        "weather",
        "GET",
        statement={
            "Action": ["dynamodb:GetItem", "dynamodb:PutItem"],
            "Effect": "Allow",
            "Resource": GetAtt("DynamoWeatherTable", "Arn"),
        },
        function_args={
            "Environment": awslambda.Environment(
                Variables={
                    "OPENWEATHER_API_KEY": "{{resolve:secretsmanager:MoodTrackerSecrets:SecretString:OpenWeatherApiKey}}"
                }
            ),
            "ReservedConcurrentExecutions": 512,
            "Metadata": {
                "checkov": {
                    "skip": [
                        {
                            "comment": "Default AWS encryption of environment variables is deemed sufficient. Likelihood of OpenWeather API key being compromised is very low. Impact is also very low because API is rate-limited and key can easily be revoked",
                            "id": "CKV_AWS_173",
                        }
                    ]
                }
            },
            # consider timeout in python request if you change this timeout
            "Timeout": 12,
        },
    )
    lambda_endpoint(
        template,
        "weekly emails",
        "DELETE",
        statement={
            "Action": "dynamodb:DeleteItem",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoWeeklyEmailsTable", "Arn"),
        },
    )
    lambda_endpoint(
        template,
        "weekly emails",
        "POST",
        statement={
            "Action": "dynamodb:PutItem",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoWeeklyEmailsTable", "Arn"),
        },
    )
    lambda_endpoint(
        template,
        "weekly emails",
        "GET",
        statement={
            "Action": "dynamodb:GetItem",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoWeeklyEmailsTable", "Arn"),
        },
    )
