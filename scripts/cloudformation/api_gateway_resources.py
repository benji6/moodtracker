from troposphere import apigateway, iam, GetAtt, Ref


def api_gateway_resources(template):
    template.add_resource(
        apigateway.RestApi(
            "ApiGateway",
            Name="MoodTrackerApi",
        )
    )
    template.add_resource(
        apigateway.Account(
            "ApiGatewayAccount",
            CloudWatchRoleArn=GetAtt("ApiGatewayCloudWatchRole", "Arn"),
        )
    )
    template.add_resource(
        apigateway.Authorizer(
            "ApiGatewayAuthorizer",
            IdentitySource="method.request.header.Authorization",
            Name="CognitoUserPoolAuthorizer",
            ProviderARNs=[GetAtt("CognitoUserPool", "Arn")],
            RestApiId=Ref("ApiGateway"),
            Type="COGNITO_USER_POOLS",
        )
    )
    template.add_resource(
        iam.Role(
            "ApiGatewayCloudWatchRole",
            AssumeRolePolicyDocument={
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": "sts:AssumeRole",
                        "Effect": "Allow",
                        "Principal": {"Service": "apigateway.amazonaws.com"},
                    }
                ],
            },
            ManagedPolicyArns=[
                "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
            ],
        )
    )
    template.add_resource(
        apigateway.Deployment(
            "ApiGatewayDeployment",
            DependsOn=[
                "ApiGatewayEventsGet",
                "ApiGatewayEventsPost",
                "ApiGatewayUsageGet",
                "ApiGatewayWeatherGet",
                "ApiGatewayWeeklyEmailsDelete",
                "ApiGatewayWeeklyEmailsGet",
                "ApiGatewayWeeklyEmailsPost",
            ],
            RestApiId=Ref("ApiGateway"),
            StageDescription=apigateway.StageDescription(
                DataTraceEnabled=True,
                LoggingLevel="ERROR",
                ThrottlingBurstLimit=4096,
                ThrottlingRateLimit=2,
            ),
            StageName="prod",
        )
    )
