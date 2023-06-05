from troposphere import location, Ref, s3, ses, sns, Sub
from modules import lambda_function, lambda_role, lambda_permission


def misc_resources(template):
    template.add_resource(
        s3.Bucket(
            "CloudFormationS3Bucket",
            Metadata={
                "checkov": {
                    "skip": [
                        {
                            "comment": "Adds unnecessary complexity and objects stored in this bucket are not sensistive (they are derived from this open source template)",
                            "id": "CKV_AWS_18",
                        },
                        {
                            "comment": "Unnecessary because template is stored in version control and S3 object can be rebuilt trivially",
                            "id": "CKV_AWS_21",
                        },
                    ]
                }
            },
            BucketEncryption=s3.BucketEncryption(
                ServerSideEncryptionConfiguration=[
                    s3.ServerSideEncryptionRule(
                        ServerSideEncryptionByDefault=s3.ServerSideEncryptionByDefault(
                            SSEAlgorithm="AES256"
                        )
                    )
                ]
            ),
            BucketName="moodtracker-cloudformation",
            PublicAccessBlockConfiguration=s3.PublicAccessBlockConfiguration(
                BlockPublicAcls=True,
                BlockPublicPolicy=True,
                IgnorePublicAcls=True,
                RestrictPublicBuckets=True,
            ),
        )
    )

    template.add_resource(
        location.PlaceIndex(
            "LocationPlaceIndex",
            DataSource="Esri",
            Description="String",
            IndexName="MoodTrackerPlaceIndex",
        ),
    )

    template.add_resource(
        ses.ReceiptRule(
            "SesReceiptRule",
            Rule=ses.Rule(
                Actions=[
                    ses.Action(SNSAction=ses.SNSAction(TopicArn=Ref("SnsTopicEmails")))
                ],
                Enabled=True,
                Name="moodtracker.link-emails-to-sns",
                Recipients=["noreply@moodtracker.link"],
                ScanEnabled=True,
            ),
            RuleSetName="default-rule-set",
        )
    )

    template.add_resource(
        sns.Topic(
            "SnsTopicEmails",
            Metadata={
                "checkov": {
                    "skip": [
                        {
                            "comment": "Encryption at rest is not deemed as necessary for this queue as it is for a noreply address and should not receive any email",
                            "id": "CKV_AWS_26",
                        }
                    ]
                }
            },
            Subscription=[
                sns.Subscription(
                    Endpoint="{{resolve:secretsmanager:MoodTrackerSecrets:SecretString:SnsEmailAddress}}",
                    Protocol="EMAIL",
                )
            ],
            TopicName="moodtracker-emails",
        )
    )
