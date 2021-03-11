import boto3
import json
import operator
from boto3.dynamodb.conditions import Attr, Key
from datetime import datetime, timedelta

headers = {
  'Access-Control-Allow-Origin': 'http://localhost:1234',
  'Content-Type': 'application/json',
}
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_events')
expression_attribute_names = {'#t': 'type'}
projection_expression='createdAt,payload,serverCreatedAt,#t'

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
          'headers': headers,
          'statusCode': 400,
        }
      # protect against pathological clock skew
      cursor_date_str = (cursor_date - timedelta(minutes=30)).isoformat()
      response = table.query(
        ExpressionAttributeNames=expression_attribute_names,
        IndexName='serverCreatedAt',
        KeyConditionExpression=Key('userId').eq(user_id) & Key('serverCreatedAt').gt(cursor_date_str),
        ProjectionExpression=projection_expression,
      )
      response['Items'].sort(key=operator.itemgetter('serverCreatedAt'))
    else:
      response = table.query(
        ExpressionAttributeNames=expression_attribute_names,
        KeyConditionExpression=Key('userId').eq(user_id),
        ProjectionExpression=projection_expression,
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
      'headers': headers,
      'statusCode': 200,
    }
  except Exception as e:
    print(e)
    return {
      'body': json.dumps({'error': 'Internal server error'}),
      'headers': headers,
      'statusCode': 500,
    }
