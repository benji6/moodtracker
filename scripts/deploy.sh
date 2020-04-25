set -euo pipefail

handle_error() {
  echo "💣 Error on line $1, exit code $2 💣"
  exit $2
}

trap 'handle_error $LINENO $?' ERR

aws cloudformation deploy --capabilities CAPABILITY_IAM --stack-name moodtracker --template-file infra/cloudformation.yml
aws cloudformation describe-stacks --query "Stacks[0].Outputs" --stack-name moodtracker | cat

echo "🍄 Deployed! 🍄"
