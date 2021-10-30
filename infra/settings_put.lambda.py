import boto3
from boto3.dynamodb.conditions import Attr
import json

HEADERS = {'Content-Type': 'application/json'}

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_settings')

def handler(event, context):
  user_id = event['requestContext']['authorizer']['claims']['sub']
  settings = json.loads(event['body'])
  settings['userId'] = user_id

  try:
    table.put_item(
      ConditionExpression=Attr('updatedAt').not_exists() | Attr('updatedAt').lt(settings['updatedAt']),
      Item=settings,
    )
    return {'statusCode': 204}
  except dynamodb.meta.client.exceptions.ConditionalCheckFailedException as e:
    return {
      'body': json.dumps({'error': 'There is a newer version of settings in the database'}),
      'headers': HEADERS,
      'statusCode': 409,
    }
  except Exception as e:
    print(e)
    return {
      'body': json.dumps({'error': 'Internal server error'}),
      'headers': HEADERS,
      'statusCode': 500,
    }
