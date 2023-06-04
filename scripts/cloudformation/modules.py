import os
from troposphere import Ref, GetAtt, Sub, Ref
import troposphere.awslambda as awslambda
import troposphere.iam as iam
import troposphere.apigateway as apigateway
from constants import INFRA_DIR


def lambda_permission(template, name, function_name, principal, source_arn):
    template.add_resource(
        awslambda.Permission(
            name,
            Action="lambda:InvokeFunction",
            FunctionName=function_name,
            Principal=principal,
            SourceArn=source_arn,
        )
    )


def lambda_role(template, name, policy_name, statement):
    return template.add_resource(
        iam.Role(
            name,
            AssumeRolePolicyDocument={
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": "sts:AssumeRole",
                        "Effect": "Allow",
                        "Principal": {"Service": "lambda.amazonaws.com"},
                    }
                ],
            },
            ManagedPolicyArns=[
                "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
            ],
            Policies=[
                iam.Policy(
                    PolicyName=policy_name,
                    PolicyDocument={
                        "Version": "2012-10-17",
                        "Statement": statement,
                    },
                ),
            ],
        )
    )


def lambda_endpoint(
    template, name, method, statement, authorization=True, function_args={}
):
    snake_case_name = name.replace(" ", "_")
    pascal_case_name = name.title().replace(" ", "")
    title_method = method.title()
    lower_method = method.lower()

    with open(
        os.path.join(INFRA_DIR, f"{snake_case_name}_{lower_method}.lambda.py")
    ) as f:
        lambda_code = f.read()

    apigateway_args = (
        {
            "AuthorizationType": "COGNITO_USER_POOLS",
            "AuthorizerId": Ref("ApiGatewayAuthorizer"),
        }
        if authorization
        else {
            "AuthorizationType": "None",
            "Metadata": {
                "checkov": {
                    "skip": [
                        {
                            "comment": "This endpoint is intentionally open",
                            "id": "CKV_AWS_59",
                        }
                    ]
                }
            },
        }
    )

    template.add_resource(
        apigateway.Method(
            f"ApiGateway{pascal_case_name}{title_method}",
            HttpMethod=method,
            Integration=apigateway.Integration(
                IntegrationHttpMethod="POST",
                Type="AWS_PROXY",
                Uri=Sub(
                    f"arn:aws:apigateway:${{AWS::Region}}:lambda:path/2015-03-31/functions/${{Lambda{pascal_case_name}{title_method}.Arn}}/invocations"
                ),
            ),
            ResourceId=Ref(f"ApiGateway{pascal_case_name}Resource"),
            RestApiId=Ref("ApiGateway"),
            **apigateway_args,
        )
    )
    template.add_resource(
        awslambda.Function(
            f"Lambda{pascal_case_name}{title_method}",
            Code=awslambda.Code(ZipFile=lambda_code),
            FunctionName=f"MoodTracker{pascal_case_name}{title_method}",
            Handler="index.handler",
            Role=GetAtt(f"Lambda{pascal_case_name}{title_method}Role", "Arn"),
            Runtime="python3.10",
            **{
                "ReservedConcurrentExecutions": Ref("ApiReservedConcurrentExecutions"),
                **function_args,
            },
        )
    )
    lambda_permission(
        template,
        f"Lambda{pascal_case_name}{title_method}Permission",
        GetAtt(f"Lambda{pascal_case_name}{title_method}", "Arn"),
        "apigateway.amazonaws.com",
        Sub("arn:aws:execute-api:${AWS::Region}:${AWS::AccountId}:${ApiGateway}/*/*"),
    )
    lambda_role(
        template,
        f"Lambda{pascal_case_name}{title_method}Role",
        f"moodtracker_lambda_{snake_case_name}_{lower_method}_policy",
        statement,
    )
