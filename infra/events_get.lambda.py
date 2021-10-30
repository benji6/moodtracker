import boto3
import json
from boto3.dynamodb.conditions import Key
from datetime import datetime, timedelta
from decimal import Decimal

HEADERS = {'Content-Type': 'application/json'}

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_events')

def handler(event, context):
  cursor_date = None
  user_id = event['requestContext']['authorizer']['claims']['sub']

  try:
    if event['queryStringParameters'] and event['queryStringParameters']['cursor']:
      try:
        cursor_date = datetime.fromisoformat(event['queryStringParameters']['cursor'])
      except ValueError as e:
        print(e)
        return {
          'body': json.dumps({'error': 'Invalid "cursor" query string parameter'}),
          'headers': HEADERS,
          'statusCode': 400,
        }

    key_condition_expression = Key('userId').eq(user_id)
    if cursor_date:
      # Defend against pathological clock skew
      cursor_date_str = (cursor_date - timedelta(minutes=30)).isoformat()
      key_condition_expression = key_condition_expression & Key('serverCreatedAt').gt(cursor_date_str)

    response = table.query(
      ExpressionAttributeNames={'#t': 'type'},
      IndexName='serverCreatedAt',
      KeyConditionExpression=key_condition_expression,
      Limit=500,
      ProjectionExpression='createdAt,payload,serverCreatedAt,#t',
    )

    events = response['Items']
    has_next_page = 'LastEvaluatedKey' in response

    last_server_created_at = None
    for event in events:
      if last_server_created_at == None:
        last_server_created_at = event['serverCreatedAt']
      elif last_server_created_at < event['serverCreatedAt']:
        last_server_created_at = event['serverCreatedAt']
      del event['serverCreatedAt']
      payload = event['payload']
      if 'location' in payload:
        payload['location'] = {
          k: float(v) if isinstance(v, Decimal) else v for k,v in payload['location'].items()
        }
      if 'mood' in payload:
        payload['mood'] = float(payload['mood'])
      elif 'seconds' in payload:
        payload['seconds'] = int(payload['seconds'])

    return {
      'body': json.dumps({
        'events': events,
        'hasNextPage': has_next_page,
        'nextCursor': last_server_created_at,
      }),
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
