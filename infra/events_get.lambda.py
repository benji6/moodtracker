import boto3
import json
import operator
from boto3.dynamodb.conditions import Attr, Key
from datetime import datetime, timedelta

EXPRESSION_ATTRIBUTE_NAMES = {'#t': 'type'}
PROJECTION_EXPRESSION='createdAt,payload,serverCreatedAt,#t'
HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:1234',
  'Content-Type': 'application/json',
}

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_events')

def handler(event, context):
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
      # protect against pathological clock skew
      cursor_date_str = (cursor_date - timedelta(minutes=30)).isoformat()
      response = table.query(
        ExpressionAttributeNames=EXPRESSION_ATTRIBUTE_NAMES,
        IndexName='serverCreatedAt',
        KeyConditionExpression=Key('userId').eq(user_id) & Key('serverCreatedAt').gt(cursor_date_str),
        ProjectionExpression=PROJECTION_EXPRESSION,
      )
      response['Items'].sort(key=operator.itemgetter('serverCreatedAt'))
    else:
      response = table.query(
        ExpressionAttributeNames=EXPRESSION_ATTRIBUTE_NAMES,
        KeyConditionExpression=Key('userId').eq(user_id),
        ProjectionExpression=PROJECTION_EXPRESSION,
      )
    events = response['Items']
    last_server_created_at = None
    for event in events:
      if last_server_created_at == None:
        last_server_created_at = event['serverCreatedAt']
      elif last_server_created_at < event['serverCreatedAt']:
        last_server_created_at = event['serverCreatedAt']
      del event['serverCreatedAt']
      payload = event['payload']
      if 'mood' in payload:
        payload['mood'] = float(payload['mood'])
    return {
      'body': json.dumps({'events': events, 'nextCursor': last_server_created_at}),
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
