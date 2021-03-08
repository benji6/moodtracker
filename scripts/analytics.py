# This script pulls the number of users and the number
# of events for each day and month from the database.
# It will not scale in a cost effective manner
# and is very rudimentary, but suffices to give a basic
# picture of usage over time for now.

import boto3
import json
import operator
from collections import defaultdict

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

list_users_response = cognito_client.list_users(UserPoolId=user_pool_id)

if 'PaginationToken' in list_users_response:
  print('Warning: only 1 cognito user pool page was scanned')

total_enabled_users = 0
user_status_breakdown = defaultdict(int)

for user in list_users_response['Users']:
  if user['Enabled']:
    total_enabled_users += 1
  user_status_breakdown[user['UserStatus']] += 1

table_scan_response = table.scan(
  ProjectionExpression='createdAt,userId',
  ReturnConsumedCapacity='TOTAL',
)

if 'LastEvaluatedKey' in table_scan_response:
  print('Warning: only 1 DynamoDB table page was scanned')

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

events_count_by_user = defaultdict(int)
for event in events:
  events_count_by_user[event['userId']] += 1

number_of_events_against_number_of_users = defaultdict(int)
for k,v in events_count_by_user.items():
  number_of_events_against_number_of_users[v] += 1

number_of_events_against_number_of_users = dict(sorted(number_of_events_against_number_of_users.items()))

print(json.dumps({
  'Breakdown by day': compute_breakdown(get_iso_date_string),
  'Breakdown by month': compute_breakdown(get_iso_month_string),
  'Number of events created against number of users that have created that many events': number_of_events_against_number_of_users,
  'DynamoDB consumed capacity units': table_scan_response['ConsumedCapacity']['CapacityUnits'],
  'Total number of events': len(events),
  'Users who have created at least 1 event': len({event['userId'] for event in events}),
  'Estimated number of users in Cognito user pool': describe_user_pool_response['UserPool']['EstimatedNumberOfUsers'],
  'Actual number of users in Cognito user pool': len(list_users_response['Users']),
  'Number of enabled users in Cognito user pool': total_enabled_users,
  'Breakdown of user totals by status in Cognito user pool': user_status_breakdown,
}, indent=2))
