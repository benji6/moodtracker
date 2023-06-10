from troposphere import dynamodb


def table(template, name, pitr=True, **kwargs):
    extra_args = (
        {
            "PointInTimeRecoverySpecification": dynamodb.PointInTimeRecoverySpecification(
                PointInTimeRecoveryEnabled=True
            )
        }
        if pitr
        else {}
    )
    template.add_resource(
        dynamodb.Table(name, BillingMode="PAY_PER_REQUEST", **extra_args, **kwargs)
    )


def dynamo_resources(template):
    table(
        template,
        "DynamoEventsTable",
        AttributeDefinitions=[
            dynamodb.AttributeDefinition(AttributeName="createdAt", AttributeType="S"),
            dynamodb.AttributeDefinition(
                AttributeName="serverCreatedAt", AttributeType="S"
            ),
            dynamodb.AttributeDefinition(AttributeName="userId", AttributeType="S"),
        ],
        KeySchema=[
            dynamodb.KeySchema(AttributeName="userId", KeyType="HASH"),
            dynamodb.KeySchema(AttributeName="createdAt", KeyType="RANGE"),
        ],
        LocalSecondaryIndexes=[
            dynamodb.LocalSecondaryIndex(
                IndexName="serverCreatedAt",
                KeySchema=[
                    dynamodb.KeySchema(AttributeName="userId", KeyType="HASH"),
                    dynamodb.KeySchema(
                        AttributeName="serverCreatedAt", KeyType="RANGE"
                    ),
                ],
                Projection=dynamodb.Projection(ProjectionType="ALL"),
            )
        ],
        TableName="moodtracker_events",
    )
    table(
        template,
        "DynamoGlobalCacheTable",
        pitr=False,
        Metadata={
            "checkov": {
                "skip": [
                    {
                        "comment": "This table is used as a simple cache so backup and recovery is unnecessary",
                        "id": "CKV_AWS_28",
                    }
                ]
            }
        },
        AttributeDefinitions=[
            dynamodb.AttributeDefinition(AttributeName="key", AttributeType="S")
        ],
        KeySchema=[dynamodb.KeySchema(AttributeName="key", KeyType="HASH")],
        TableName="moodtracker_global_cache",
        TimeToLiveSpecification=dynamodb.TimeToLiveSpecification(
            AttributeName="expiresAt", Enabled=True
        ),
    )
    table(
        template,
        "DynamoWebPushTokensTable",
        AttributeDefinitions=[
            dynamodb.AttributeDefinition(AttributeName="userId", AttributeType="S"),
            dynamodb.AttributeDefinition(
                AttributeName="createdAt",
                AttributeType="S",
            ),
        ],
        KeySchema=[
            dynamodb.KeySchema(AttributeName="userId", KeyType="HASH"),
            dynamodb.KeySchema(AttributeName="createdAt", KeyType="RANGE"),
        ],
        TableName="moodtracker_web_push_tokens",
    )
    table(
        template,
        "DynamoWeatherTable",
        AttributeDefinitions=[
            dynamodb.AttributeDefinition(
                AttributeName="coordinates", AttributeType="S"
            ),
            dynamodb.AttributeDefinition(AttributeName="timestamp", AttributeType="N"),
        ],
        KeySchema=[
            dynamodb.KeySchema(AttributeName="coordinates", KeyType="HASH"),
            dynamodb.KeySchema(AttributeName="timestamp", KeyType="RANGE"),
        ],
        TableName="moodtracker_weather",
    )
    table(
        template,
        "DynamoWeeklyEmailsTable",
        AttributeDefinitions=[
            dynamodb.AttributeDefinition(AttributeName="userId", AttributeType="S")
        ],
        KeySchema=[dynamodb.KeySchema(AttributeName="userId", KeyType="HASH")],
        TableName="moodtracker_weekly_emails",
    )
