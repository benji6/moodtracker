import boto3
from datetime import date
import dateutil
import json
import operator
from collections import defaultdict

dynamodb = boto3.resource('dynamodb')
events_table = dynamodb.Table('moodtracker_events')

events_table_scan_response = events_table.scan(
  ExpressionAttributeNames={'#t': 'type'},
  ProjectionExpression='createdAt,#t,userId',
)
events = events_table_scan_response['Items']
while 'LastEvaluatedKey' in events_table_scan_response:
  events_table_scan_response = events_table.scan(
    ExclusiveStartKey=events_table_scan_response['LastEvaluatedKey'],
    ExpressionAttributeNames={'#t': 'type'},
    ProjectionExpression='createdAt,#t,userId',
  )
  events += events_table_scan_response['Items']

events.sort(key=operator.itemgetter('createdAt'))

def date_from_js_iso(js_iso_string):
  return date.fromisoformat(js_iso_string[:10])

for event in events:
  event['created_at_date'] = date_from_js_iso(event['createdAt'])

def compute_breakdown(get_key):
  results = {}

  for event in events:
    key = get_key(event['createdAt'])
    stats = results.get(key)
    if stats:
      stats['events'] += 1
      stats['userIds'].add(event['userId'])
    else:
      results[key] = {'events': 1, 'userIds': {event['userId']}}

  for k,v in results.items():
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
