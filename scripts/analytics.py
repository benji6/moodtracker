# This script pulls the number of users and the number
# of events for each day and month from the database.
# It will not scale in a cost effective manner
# and is very rudimentary, but suffices to give a basic
# picture of usage over time for now.

import boto3
import json
import operator

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_events')

response = table.scan(
  ProjectionExpression='createdAt,userId',
  ReturnConsumedCapacity='TOTAL',
)

if 'LastEvaluatedKey' in response:
  print('Warning: only 1 page was scanned')

events = response['Items']
events.sort(key=operator.itemgetter('createdAt'))

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

def get_iso_date_string(date_time_string):
  return date_time_string[0:10]

def get_iso_month_string(date_time_string):
  return date_time_string[0:7]

print(json.dumps({
  'Consumed capacity': response['ConsumedCapacity'],
  'Breakdown by day': compute_breakdown(get_iso_date_string),
  'Breakdown by month': compute_breakdown(get_iso_month_string),
  'Users who have created at least 1 event': len({event['userId'] for event in events}),
}, indent=2))
