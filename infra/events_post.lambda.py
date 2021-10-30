import boto3
import json
from datetime import datetime
from decimal import Decimal

HEADERS = {'Content-Type': 'application/json'}

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_events')

def handler(event, context):
  user_id = event['requestContext']['authorizer']['claims']['sub']

  try:
    events = json.loads(event['body'], parse_float=Decimal)
  except json.JSONDecodeError as e:
    print(e)
    return {
      'body': json.dumps({'error': 'Malformed request body'}),
      'headers': HEADERS,
      'statusCode': 400,
    }
  try:
    with table.batch_writer() as batch:
      for event in events:
        event['serverCreatedAt'] = datetime.utcnow().isoformat()
        event['userId'] = user_id
        batch.put_item(Item=event)
    return {'statusCode': 204}
  except Exception as e:
    print(e)
    return {
      'body': json.dumps({'error': 'Internal server error'}),
      'headers': HEADERS,
      'statusCode': 500,
    }
