import os
from troposphere import (
    Output,
    Parameter,
    Ref,
    Sub,
    Template,
)
from api_gateway_resources import api_gateway_resources
from cognito_resources import cognito_resources
from dynamo_resources import dynamo_resources
from http_api_resources import http_api_resources
from misc_resources import misc_resources
from send_weekly_email_resources import send_weekly_email_resources

template = Template()
template.set_version("2010-09-09")
template.add_parameter(
    Parameter(
        "ApiReservedConcurrentExecutions",
        Default=10,
        Description="This is used as the default value for most lambdas and is based on the number of active users. Some lambdas have different limits because their usage patterns are different",
        NoEcho=True,
        Type="Number",
    )
)
template.add_parameter(
    Parameter(
        "SesNoreplyArn",
        Default="arn:aws:ses:us-east-1:315965384508:identity/noreply@moodtracker.link",
        Description="ARN for the MoodTracker noreply email address",
        NoEcho=True,
        Type="String",
    )
)


template.add_output(
    Output(
        "ApiGatewayDeployCommand",
        Value=Sub(
            "aws apigateway create-deployment --rest-api-id ${ApiGateway} --stage-name prod | cat"
        ),
    )
)
template.add_output(
    Output(
        "ApiGatewayUrl",
        Value=Sub("https://${ApiGateway}.execute-api.us-east-1.amazonaws.com/prod"),
    )
)
template.add_output(
    Output(
        "CognitoClientId",
        Value=Ref("CognitoUserPoolClient"),
    )
)
template.add_output(
    Output(
        "CognitoUserPoolId",
        Value=Ref("CognitoUserPool"),
    )
)
template.add_output(
    Output(
        "CognitoIdentityPoolId",
        Value=Ref("CognitoIdentityPool"),
    )
)


api_gateway_resources(template)
cognito_resources(template)
dynamo_resources(template)
http_api_resources(template)
misc_resources(template)
send_weekly_email_resources(template)


with open(
    os.path.join(os.path.dirname(__file__), "..", "..", "infra", "cloudformation.yml"),
    "w",
) as file:
    file.write(template.to_yaml())
