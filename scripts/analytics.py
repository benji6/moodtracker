# This script pulls the number of users and the number
# of events for each day from the database.
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
  ReturnConsumedCapacity='TOTAL'
)

print(response['ConsumedCapacity'])

if 'LastEvaluatedKey' in response:
  print('Warning: only 1 page was scanned')

events = response['Items']
events.sort(key=operator.itemgetter('createdAt'))

results = {}
for event in events:
  key = event['createdAt'].split('T')[0]
  stats = results.get(key)
  if stats:
    stats['events'] += 1
    stats['userIds'].add(event['userId'])
  else:
    results[key] = {'events': 1, 'userIds': {event['userId']}}

for k,v in results.items():
  v['users'] = len(v['userIds'])
  del v['userIds']

print(json.dumps(results, indent=2))
