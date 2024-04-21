from troposphere import awslambda, GetAtt, Ref, Sub
from modules import api_gateway_resource, lambda_api_method


def http_api_resources(template):
    api_gateway_resource(template, "ApiGatewayEventsResource", PathPart="events")
    lambda_api_method(
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
        function_args={
            # In testing it takes about 1 second to get 1000 events
            # Limit=1000 is defined in Python
            "Timeout": 5,
        },
    )
    lambda_api_method(
        template,
        "events",
        "POST",
        {
            "Action": "dynamodb:BatchWriteItem",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoEventsTable", "Arn"),
        },
    )

    api_gateway_resource(template, "ApiGatewayUsageResource", PathPart="usage")
    lambda_api_method(
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
                "Resource": [
                    GetAtt("DynamoWebPushTokensTable", "Arn"),
                    GetAtt("DynamoWeeklyEmailsTable", "Arn"),
                ],
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

    api_gateway_resource(template, "ApiGatewayWeatherResource", PathPart="weather")
    lambda_api_method(
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

    api_gateway_resource(
        template, "ApiGatewayWebPushTokensResource", PathPart="web-push-tokens"
    )
    lambda_api_method(
        template,
        "web push tokens",
        "GET",
        statement={
            "Action": "dynamodb:Query",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoWebPushTokensTable", "Arn"),
        },
    )
    api_gateway_resource(
        template,
        "ApiGatewayWebPushTokensPathResource",
        ParentId=Ref("ApiGatewayWebPushTokensResource"),
        PathPart="{token}",
    )
    lambda_api_method(
        template,
        "web push tokens",
        "DELETE",
        ResourceId=Ref(f"ApiGatewayWebPushTokensPathResource"),
        statement={
            "Action": "dynamodb:DeleteItem",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoWebPushTokensTable", "Arn"),
        },
    )
    lambda_api_method(
        template,
        "web push tokens",
        "PUT",
        ResourceId=Ref(f"ApiGatewayWebPushTokensPathResource"),
        statement={
            "Action": "dynamodb:PutItem",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoWebPushTokensTable", "Arn"),
        },
    )

    api_gateway_resource(
        template, "ApiGatewayWeeklyEmailsResource", PathPart="weekly-emails"
    )
    lambda_api_method(
        template,
        "weekly emails",
        "DELETE",
        statement={
            "Action": "dynamodb:DeleteItem",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoWeeklyEmailsTable", "Arn"),
        },
    )
    lambda_api_method(
        template,
        "weekly emails",
        "POST",
        statement={
            "Action": "dynamodb:PutItem",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoWeeklyEmailsTable", "Arn"),
        },
    )
    lambda_api_method(
        template,
        "weekly emails",
        "GET",
        statement={
            "Action": "dynamodb:GetItem",
            "Effect": "Allow",
            "Resource": GetAtt("DynamoWeeklyEmailsTable", "Arn"),
        },
    )
