import boto3
from datetime import date
import json
import operator
from collections import defaultdict

dynamodb = boto3.resource('dynamodb')
events_table = dynamodb.Table('moodtracker_events')

events_table_scan_response = events_table.scan(
  ExpressionAttributeNames={'#t': 'type'},
  ProjectionExpression='createdAt,#t,userId',
  ReturnConsumedCapacity='TOTAL',
)
events = events_table_scan_response['Items']
while 'LastEvaluatedKey' in events_table_scan_response:
  events_table_scan_response = events_table.scan(
    ExclusiveStartKey=events_table_scan_response['LastEvaluatedKey'],
    ExpressionAttributeNames={'#t': 'type'},
    ProjectionExpression='createdAt,#t,userId',
    ReturnConsumedCapacity='TOTAL',
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

events_count_by_user = defaultdict(int)
for event in events:
  events_count_by_user[event['userId']] += 1

number_of_events_against_number_of_users = defaultdict(int)
for k,v in events_count_by_user.items():
  number_of_events_against_number_of_users[v] += 1

number_of_events_against_number_of_users = dict(sorted(number_of_events_against_number_of_users.items()))

print(json.dumps({
  'Breakdown by month': compute_breakdown(get_iso_month_string),
  'Number of events created against number of users that have created that many events': number_of_events_against_number_of_users,
}, indent=2))
