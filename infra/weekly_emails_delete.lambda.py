import boto3
import json

HEADERS_NO_CONTENT = {
  'Access-Control-Allow-Origin': 'http://localhost:1234',
}
HEADERS = {
  **HEADERS_NO_CONTENT,
  'Content-Type': 'application/json',
}

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_weekly_emails')

def handler(event, context):
  user_id = event['requestContext']['authorizer']['claims']['sub']

  try:
    table.delete_item(Key={'userId': user_id})
    return {
      'headers': HEADERS_NO_CONTENT,
      'statusCode': 204,
    }
  except Exception as e:
    print(e)
    return {
      'body': json.dumps({'error': 'Internal server error'}),
      'headers': HEADERS,
      'statusCode': 500,
    }
