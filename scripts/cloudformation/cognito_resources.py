from troposphere import cognito, iam, GetAtt, Ref


def cognito_resources(template):
    template.add_resource(
        cognito.IdentityPool(
            "CognitoIdentityPool",
            AllowUnauthenticatedIdentities=False,
            CognitoIdentityProviders=[
                cognito.CognitoIdentityProvider(
                    ClientId=Ref("CognitoUserPoolClient"),
                    ProviderName=GetAtt("CognitoUserPool", "ProviderName"),
                    ServerSideTokenCheck=True,
                )
            ],
            IdentityPoolName="moodtracker",
        )
    )
    template.add_resource(
        iam.Role(
            "CognitoIdentityPoolRole",
            AssumeRolePolicyDocument={
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": "sts:AssumeRoleWithWebIdentity",
                        "Condition": {
                            "StringEquals": {
                                "cognito-identity.amazonaws.com:aud": Ref(
                                    "CognitoIdentityPool"
                                )
                            },
                            "ForAnyValue:StringLike": {
                                "cognito-identity.amazonaws.com:amr": "authenticated"
                            },
                        },
                        "Effect": "Allow",
                        "Principal": {"Federated": "cognito-identity.amazonaws.com"},
                    }
                ],
            },
            Policies=[
                iam.Policy(
                    PolicyName="moodtracker_idp_places_policy",
                    PolicyDocument={
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Action": ["geo:SearchPlaceIndexForPosition"],
                                "Effect": "Allow",
                                "Resource": GetAtt("LocationPlaceIndex", "Arn"),
                            }
                        ],
                    },
                )
            ],
        )
    )
    template.add_resource(
        cognito.IdentityPoolRoleAttachment(
            "CognitoIdentityPoolRoleAttachment",
            IdentityPoolId=Ref("CognitoIdentityPool"),
            Roles={"authenticated": GetAtt("CognitoIdentityPoolRole", "Arn")},
        )
    )
    template.add_resource(
        cognito.UserPool(
            "CognitoUserPool",
            AccountRecoverySetting=cognito.AccountRecoverySetting(
                RecoveryMechanisms=[
                    cognito.RecoveryOption(Name="verified_email", Priority=1)
                ]
            ),
            AutoVerifiedAttributes=["email"],
            EmailConfiguration=cognito.EmailConfiguration(
                EmailSendingAccount="DEVELOPER",
                From="noreply@moodtracker.link",
                SourceArn=Ref("SesNoreplyArn"),
            ),
            Policies=cognito.Policies(
                PasswordPolicy=cognito.PasswordPolicy(
                    MinimumLength=8,
                    RequireLowercase=True,
                    RequireNumbers=True,
                    RequireSymbols=False,
                    RequireUppercase=True,
                )
            ),
            UserAttributeUpdateSettings=cognito.UserAttributeUpdateSettings(
                AttributesRequireVerificationBeforeUpdate=["email"]
            ),
            UsernameAttributes=["email"],
            UsernameConfiguration=cognito.UsernameConfiguration(CaseSensitive=False),
            UserPoolName="moodtracker",
            VerificationMessageTemplate=cognito.VerificationMessageTemplate(
                DefaultEmailOption="CONFIRM_WITH_LINK",
                EmailMessageByLink="Welcome to MoodTracker! You're almost signed up, just {##follow this link to verify your email address##}, then go back to the app and sign in!",
                EmailSubjectByLink="MoodTracker email verification",
            ),
        )
    )
    template.add_resource(
        cognito.UserPoolClient(
            "CognitoUserPoolClient",
            PreventUserExistenceErrors="ENABLED",
            RefreshTokenValidity=365,  # max value in days
            UserPoolId=Ref("CognitoUserPool"),
        )
    )
    template.add_resource(
        cognito.UserPoolDomain(
            "CognitoUserPoolDomain",
            Domain="moodtracker",
            UserPoolId=Ref("CognitoUserPool"),
        )
    )
