import boto3
import json
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_events')

def handler(event, context):
  user_id = event['requestContext']['authorizer']['claims']['sub']
  headers = {
    'Access-Control-Allow-Origin': 'http://localhost:1234',
    'Content-Type': 'application/json',
  }
  try:
    events = json.loads(event['body'])
  except json.JSONDecodeError as e:
    print(e)
    return {
      'body': json.dumps({'error': 'Malformed request body'}),
      'headers': headers,
      'statusCode': 400,
    }
  try:
    with table.batch_writer() as batch:
      for event in events:
        event['serverCreatedAt'] = datetime.now().isoformat()
        event['userId'] = user_id
        batch.put_item(Item=event)
    del headers['Content-Type']
    return {'headers': headers, 'statusCode': 204}
  except Exception as e:
    print(e)
    return {
      'body': json.dumps({'error': 'Internal server error'}),
      'headers': headers,
      'statusCode': 500,
    }
