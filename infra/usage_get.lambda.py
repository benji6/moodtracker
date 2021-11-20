import boto3
from boto3.dynamodb.conditions import Attr
from datetime import datetime, timedelta
import json

HEADERS = {'Content-Type': 'application/json'}
USER_POOL_ID = 'us-east-1_rdB8iu5X4'

cache = {}

cognito_client = boto3.client('cognito-idp')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_events')

def handler(event, context):
  now = datetime.now()
  consumed_capacity_units = 0
  confirmed_users = 0
  memoryCacheHit = True
  user_pages=0

  if 'updated_at' not in cache or now - cache.get('updated_at') > timedelta(1):
    memoryCacheHit = False

    try:
      users_response = cognito_client.list_users(UserPoolId=USER_POOL_ID)
      users = users_response['Users']
      user_pages = 1
      while 'PaginationToken' in users_response:
        users_response = cognito_client.list_users(
          PaginationToken=users_response['PaginationToken'],
          UserPoolId=USER_POOL_ID,
        )
        users += users_response['Users']
        user_pages += 1
    except Exception as e:
      print(e)
      return {
        'body': json.dumps({'error': 'Internal server error'}),
        'headers': HEADERS,
        'statusCode': 500,
      }

    for user in users:
      if user['Enabled'] and user['UserStatus'] == 'CONFIRMED':
        confirmed_users += 1

    filter_expression = Attr('createdAt').gt((now - timedelta(30)).isoformat())

    try:
      events_response = table.scan(
        ExpressionAttributeNames={'#t': 'type'},
        FilterExpression=filter_expression,
        ProjectionExpression='createdAt,#t,userId',
        ReturnConsumedCapacity='TOTAL',
      )
      events = events_response['Items']
      consumed_capacity_units = events_response['ConsumedCapacity']['CapacityUnits']

      while 'LastEvaluatedKey' in events_response:
        events_response = table.scan(
          ExclusiveStartKey=events_response['LastEvaluatedKey'],
          ExpressionAttributeNames={'#t': 'type'},
          FilterExpression=filter_expression,
          ProjectionExpression='createdAt,#t,userId',
          ReturnConsumedCapacity='TOTAL',
        )
        events += events_response['Items']
        consumed_capacity_units += events_response['ConsumedCapacity']['CapacityUnits']
    except Exception as e:
      print(e)
      return {
        'body': json.dumps({'error': 'Internal server error'}),
        'headers': HEADERS,
        'statusCode': 500,
      }

    cache['updated_at'] = now
    cache['response'] = {
      'body': json.dumps({
        'confirmedUsers': confirmed_users,
        'MAUs': len({event['userId'] for event in events}),
        'WAUs': len({event['userId'] for event in events if datetime.fromisoformat(event['createdAt'][:-1]) > now - timedelta(7)}),
      }),
      'headers': HEADERS,
      'statusCode': 200,
    }

  print({
    'consumedCapacityUnits': consumed_capacity_units,
    'memoryCacheHit': memoryCacheHit,
    'user_pages': user_pages,
  })

  return cache['response']
