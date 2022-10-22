set -euo pipefail

handle_error() {
  echo "💣 Error on line $1, exit code $2 💣"
  exit $2
}

trap 'handle_error $LINENO $?' ERR

echo "⏳ Creating change set... ⏳"

changesetid=$(aws cloudformation create-change-set --capabilities CAPABILITY_IAM --change-set-name release-candidate --stack-name moodtracker --tags Key=Application,Value=MoodTracker --template-body file://infra/cloudformation.yml | jq '.Id')

echo "⏳ Waiting for change set creation to complete... ⏳"

eval aws cloudformation wait change-set-create-complete --change-set-name $changesetid

echo "🍄 Change set created successfully! 🍄"

echo "\nVIEW the change set:"
echo "aws cloudformation describe-change-set --change-set-name $changesetid --query 'Changes[*].ResourceChange.{Action:Action,Resource:ResourceType,ResourceId:LogicalResourceId,ReplacementNeeded:Replacement}'"

echo "\nDELETE the change set:"
echo "aws cloudformation delete-change-set --change-set-name $changesetid | cat"

echo "\nEXECUTE the change set:"
echo "aws cloudformation execute-change-set --change-set-name $changesetid | cat && aws cloudformation wait stack-update-complete --stack-name moodtracker && aws cloudformation describe-stacks --query 'Stacks[0].Outputs' --stack-name moodtracker | cat"
