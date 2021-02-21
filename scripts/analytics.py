# This script pulls the number of users and the number
# of events for each day and month from the database.
# It will not scale in a cost effective manner
# and is very rudimentary, but suffices to give a basic
# picture of usage over time for now.

import boto3
import json
import operator

cognito_client = boto3.client('cognito-idp')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('moodtracker_events')

list_user_pools_response = cognito_client.list_user_pools(MaxResults=8)

for pool in list_user_pools_response['UserPools']:
  if pool['Name'] == 'moodtracker':
    user_pool_id = pool['Id']
    break

try:
  describe_user_pool_response = cognito_client.describe_user_pool(UserPoolId=user_pool_id)
except NameError as e:
  raise Exception('Failed to find moodtracker user pool') from e

table_scan_response = table.scan(
  ProjectionExpression='createdAt,userId',
  ReturnConsumedCapacity='TOTAL',
)

if 'LastEvaluatedKey' in table_scan_response:
  print('Warning: only 1 page was scanned')

events = table_scan_response['Items']
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
  'Breakdown by day': compute_breakdown(get_iso_date_string),
  'Breakdown by month': compute_breakdown(get_iso_month_string),
  'DynamoDB consumed capacity units': table_scan_response['ConsumedCapacity']['CapacityUnits'],
  'Users who have created at least 1 event': len({event['userId'] for event in events}),
  'Estimated number of users in Cognito user pool': describe_user_pool_response['UserPool']['EstimatedNumberOfUsers'],
}, indent=2))
