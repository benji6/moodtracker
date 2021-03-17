import boto3
import json
from boto3.dynamodb.conditions import Key

HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:1234',
  'Content-Type': 'application/json',
}

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_weekly_emails')

def handler(event, context):
  user_id = event['requestContext']['authorizer']['claims']['sub']

  try:
    response = table.query(
      KeyConditionExpression=Key('userId').eq(user_id),
      Select='COUNT',
    )

    if response['Count']:
      return {
        'body': json.dumps({'enabled': True}),
        'headers': HEADERS,
        'statusCode': 200,
      }

    return {
      'body': json.dumps({'error': 'Not found'}),
      'headers': HEADERS,
      'statusCode': 404,
    }
  except Exception as e:
    print(e)
    return {
      'body': json.dumps({'error': 'Internal server error'}),
      'headers': HEADERS,
      'statusCode': 500,
    }
