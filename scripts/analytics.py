import boto3
from datetime import date
import dateutil
import json
import operator
import statistics
from collections import defaultdict, OrderedDict

users = boto3.client('cognito-idp').get_paginator('list_users').paginate(
  UserPoolId='us-east-1_rdB8iu5X4',
  AttributesToGet=[],
).build_full_result()['Users']
users_by_creation_month = defaultdict(lambda: defaultdict(int))
for u in users:
  key = 'confirmed' if u['Enabled'] and u['UserStatus'] == 'CONFIRMED' else 'unconfirmed'
  users_by_creation_month[u['UserCreateDate'].date().isoformat()[:7]][key] += 1

dynamodb = boto3.resource('dynamodb')
events_table = dynamodb.Table('moodtracker_events')

events_table_scan_response = events_table.scan(
  ExpressionAttributeNames={'#t': 'type'},
  ProjectionExpression='createdAt,payload,#t,userId',
)
events = events_table_scan_response['Items']
while 'LastEvaluatedKey' in events_table_scan_response:
  events_table_scan_response = events_table.scan(
    ExclusiveStartKey=events_table_scan_response['LastEvaluatedKey'],
    ExpressionAttributeNames={'#t': 'type'},
    ProjectionExpression='createdAt,payload,#t,userId',
  )
  events += events_table_scan_response['Items']

events.sort(key=operator.itemgetter('createdAt'))

meditations = OrderedDict()
moods = OrderedDict()
for event in events:
  event['created_at_date'] = date.fromisoformat(event['createdAt'][:10])

  if event['type'] == 'v1/meditations/create':
    meditations[event['createdAt']] = event['payload']
  if event['type'] == 'v1/meditations/delete':
    del meditations[event['payload']]

  if event['type'] == 'v1/moods/create':
    moods[event['createdAt']] = event['payload']
  if event['type'] == 'v1/moods/delete':
    del moods[event['payload']]
  if event['type'] == 'v1/moods/update':
    moods[event['payload']['id']] = {**moods[event['payload']['id']], **event['payload']}
    del moods[event['payload']['id']]['id']

def compute_breakdown(get_key):
  results = {}

  for event in events:
    key = get_key(event['createdAt'])
    stats = results.get(key)
    if stats:
      stats['events'] += 1
      stats['userIds'].add(event['userId'])
    else:
      results[key] = {
        'events': 1,
        'meditationSeconds': 0,
        'moods': [],
        'userIds': {event['userId']},
      }

  for k,v in meditations.items():
    stats = results.get(get_key(k))
    stats['meditationSeconds'] += int(v['seconds'])

  for k,v in moods.items():
    stats = results.get(get_key(k))
    stats['moods'].append(int(v['mood']))

  for k,v in results.items():
    v['meanMood'] = round(statistics.mean(v['moods']), 1)
    del v['moods']
    v['meditationMinutes'] = round(v['meditationSeconds'] / 60)
    del v['meditationSeconds']
    v['newConfirmedUsers'] = users_by_creation_month[k]['confirmed']
    v['newUnconfirmedUsers'] = users_by_creation_month[k]['unconfirmed']
    v['users'] = len(v['userIds'])
    del v['userIds']

  return results

def get_iso_month_string(date_time_string):
  return date_time_string[0:7]

events_by_user_id = defaultdict(list)
for event in events:
  events_by_user_id[event['userId']].append(event)

number_of_events_by_number_of_users = defaultdict(int)
for k,v in events_by_user_id.items():
  number_of_events_by_number_of_users[len(v)] += 1
number_of_events_by_number_of_users = dict(sorted(number_of_events_by_number_of_users.items()))

number_of_users_by_days_used = defaultdict(int)
for k,v in events_by_user_id.items():
  if len(v) == 1:
    number_of_users_by_days_used[0] += 1
  else:
    t0 = dateutil.parser.isoparse(v[0]['createdAt'])
    t1 = dateutil.parser.isoparse(v[-1]['createdAt'])
    number_of_users_by_days_used[(t1 - t0).days] += 1
number_of_users_by_days_used = dict(sorted(number_of_users_by_days_used.items()))

print(json.dumps({
  'Breakdown by month': compute_breakdown(get_iso_month_string),
  'Number of events created is the key and number of users is the value': number_of_events_by_number_of_users,
  'Days used is the key and number of users is the value': number_of_users_by_days_used,
}, indent=2))
