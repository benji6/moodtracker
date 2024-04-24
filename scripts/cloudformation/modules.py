import os
from troposphere import Ref, GetAtt, Sub, Ref, iam, awslambda, apigateway


def api_gateway_resource(
    template, name, ParentId=GetAtt("ApiGateway", "RootResourceId"), **kwargs
):
    template.add_resource(
        apigateway.Resource(
            name,
            ParentId=ParentId,
            RestApiId=Ref("ApiGateway"),
            **kwargs,
        )
    )


def lambda_function(template, name, code_filename, **kwargs):
    with open(os.path.join(os.path.dirname(__file__), "lambdas", code_filename)) as f:
        lambda_code = f.read()

    template.add_resource(
        awslambda.Function(
            name,
            Code=awslambda.Code(ZipFile=lambda_code),
            Handler="index.handler",
            Runtime="python3.12",
            **kwargs,
        )
    )


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


def lambda_api_method(
    template,
    name,
    method,
    statement,
    authorization=True,
    function_args={},
    ResourceId=None,
):
    snake_case_name = name.replace(" ", "_")
    pascal_case_name = name.title().replace(" ", "")
    title_method = method.title()
    lower_method = method.lower()

    apigateway_args = (
        {
            "AuthorizationType": "COGNITO_USER_POOLS",
            "AuthorizerId": Ref("ApiGatewayAuthorizer"),
        }
        if authorization
        else {
            "AuthorizationType": "NONE",
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
            ResourceId=(
                ResourceId
                if ResourceId
                else Ref(f"ApiGateway{pascal_case_name}Resource")
            ),
            RestApiId=Ref("ApiGateway"),
            **apigateway_args,
        )
    )
    lambda_function(
        template,
        f"Lambda{pascal_case_name}{title_method}",
        code_filename=f"{snake_case_name}_{lower_method}.py",
        FunctionName=f"MoodTracker{pascal_case_name}{title_method}",
        Role=GetAtt(f"Lambda{pascal_case_name}{title_method}Role", "Arn"),
        **{
            "ReservedConcurrentExecutions": Ref("ApiReservedConcurrentExecutions"),
            **function_args,
        },
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
