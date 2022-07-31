import boto3
import email
import json
import statistics
from boto3.dynamodb.conditions import Attr
from datetime import datetime, timedelta

CACHE_KEY = 'usage'
HEADERS = {'Content-Type': 'application/json'}
SECONDS_PER_DAY = 86400
USER_POOL_ID = 'us-east-1_rdB8iu5X4'

cache = {}

cognito_client = boto3.client('cognito-idp')
dynamodb = boto3.resource('dynamodb')
cache_table = dynamodb.Table('moodtracker_global_cache')
events_table = dynamodb.Table('moodtracker_events')
settings_table = dynamodb.Table('moodtracker_settings')
weekly_emails_table = dynamodb.Table('moodtracker_weekly_emails')

def handler(event, context):
  now = datetime.now()
  days_ago_1 = now - timedelta(1)
  days_ago_7 = now - timedelta(7)
  days_ago_30 = now - timedelta(30)
  days_ago_60 = now - timedelta(60)
  consumed_capacity_units = 0
  confirmed_users = 0
  db_cache_hit = False
  memory_cache_hit = False
  user_pages=0

  def log():
    print({
      'consumedCapacityUnits': consumed_capacity_units,
      'dbCacheHit': db_cache_hit,
      'memoryCacheHit': memory_cache_hit,
      'userPages': user_pages,
    })

  if 'expires_at' in cache and now.timestamp() <= cache['expires_at']:
    memory_cache_hit = True
    log()
    return cache['data']

  try:
    cache_response = cache_table.get_item(Key={'key': CACHE_KEY})
    item = cache_response.get('Item')
    if item:
      db_cache_hit = True
      cache['expires_at'] = item['expiresAt']
      cache['data'] = item['data']
      log()
      return cache['data']
  except Exception as e:
    print(e)

  events_filter_expression = Attr('createdAt').gt(days_ago_60.isoformat())

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
    
    events_response = events_table.scan(
      ExpressionAttributeNames={'#t': 'type'},
      FilterExpression=events_filter_expression,
      ProjectionExpression='createdAt,payload,#t,userId',
      ReturnConsumedCapacity='TOTAL',
    )
    events = events_response['Items']
    consumed_capacity_units = events_response['ConsumedCapacity']['CapacityUnits']
    while 'LastEvaluatedKey' in events_response:
      events_response = events_table.scan(
        ExclusiveStartKey=events_response['LastEvaluatedKey'],
        ExpressionAttributeNames={'#t': 'type'},
        FilterExpression=events_filter_expression,
        ProjectionExpression='createdAt,payload,#t,userId',
        ReturnConsumedCapacity='TOTAL',
      )
      events += events_response['Items']
      consumed_capacity_units += events_response['ConsumedCapacity']['CapacityUnits']

    settings_response = settings_table.scan(
      ReturnConsumedCapacity='TOTAL',
    )
    settings = settings_response['Items']
    consumed_capacity_units += settings_response['ConsumedCapacity']['CapacityUnits']
    while 'LastEvaluatedKey' in settings_response:
      settings_response = settings_table.scan(
        ExclusiveStartKey=settings_response['LastEvaluatedKey'],
        ReturnConsumedCapacity='TOTAL',
      )
      settings += settings_response['Items']
      consumed_capacity_units += settings_response['ConsumedCapacity']['CapacityUnits']

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

  user_ids_in_current_30_day_window = set()
  user_ids_in_previous_30_day_window = set()
  meditation_MAU_ids = set()
  events_in_last_30_days = 0
  meditations = {}
  moods = {}
  for event in events:
    event['createdAt'] = datetime.fromisoformat(event['createdAt'][:-1])
    if event['createdAt'] > days_ago_30:
      events_in_last_30_days += 1
      user_ids_in_current_30_day_window.add(event['userId'])

      if event['type'] == 'v1/meditations/create':
        meditation_MAU_ids.add(event['userId'])
        meditations[event['createdAt']] = event['payload']
      if event['type'] == 'v1/meditations/delete':
        meditations.pop(event['payload'], None)

      if event['type'] == 'v1/moods/create':
        moods[event['createdAt']] = event['payload']
      if event['type'] == 'v1/moods/delete':
        moods.pop(event['payload'], None)
      if event['type'] == 'v1/moods/update':
        if event['payload']['id'] in moods:
          moods[event['payload']['id']] = {**moods[event['payload']['id']], **event['payload']}
          del moods[event['createdAt']]['id']


    else:
      user_ids_in_previous_30_day_window.add(event['userId'])

  meditation_seconds = 0
  for k,v in meditations.items():
    meditation_seconds += int(v['seconds'])

  cache['expires_at'] = round(now.timestamp() + SECONDS_PER_DAY)
  cache['data'] = {
    'body': json.dumps({
      'confirmedUsers': confirmed_users,
      'eventsInLast30Days': events_in_last_30_days,
      'meanMoodInLast30Days': round(float(statistics.mean([v['mood'] for v in moods.values()])), 1),
      'meanMoodInLast7Days': round(float(statistics.mean([v['mood'] for k,v in moods.items() if k > days_ago_7])), 1),
      'meditationMAUs': len(meditation_MAU_ids),
      'meditationSecondsInLast30Days': meditation_seconds,
      'usersWithLocation': sum(1 for setting in settings if setting['recordLocation']),
      'usersWithWeeklyEmails': weekly_emails_table.item_count,
      'CRR': round(1 - len(user_ids_in_previous_30_day_window - user_ids_in_current_30_day_window) / len(user_ids_in_previous_30_day_window), 3),
      'DAUs': len({event['userId'] for event in events if event['createdAt'] > days_ago_1}),
      'MAUs': len(user_ids_in_current_30_day_window),
      'WAUs': len({event['userId'] for event in events if event['createdAt'] > days_ago_7}),
    }),
    'headers': {
      **HEADERS,
      'Cache-Control': 'immutable',
      'Expires': email.utils.formatdate(cache['expires_at'], usegmt=True),
    },
    'statusCode': 200,
  }

  try:
    cache_table.put_item(Item={
      'key': CACHE_KEY,
      'data': cache['data'],
      'expiresAt': cache['expires_at'],
    })
  except Exception as e:
    print(e)

  log()
  return cache['data']
