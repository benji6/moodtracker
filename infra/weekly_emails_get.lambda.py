import boto3
import json

HEADERS = {'Content-Type': 'application/json'}

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_weekly_emails')

def handler(event, context):
  user_id = event['requestContext']['authorizer']['claims']['sub']

  try:
    response = table.get_item(Key={'userId': user_id})

    if 'Item' not in response:
      return {
        'body': json.dumps({'error': 'Not found'}),
        'headers': HEADERS,
        'statusCode': 404,
      }

    return {
      'body': json.dumps({'enabled': True}),
      'headers': HEADERS,
      'statusCode': 200,
    }

  except Exception as e:
    print(e)
    return {
      'body': json.dumps({'error': 'Internal server error'}),
      'headers': HEADERS,
      'statusCode': 500,
    }
