set -e

aws cloudformation deploy --capabilities CAPABILITY_IAM --stack-name moodtracker --template-file infra/cloudformation.yml
aws cloudformation describe-stacks --query "Stacks[0].Outputs" --stack-name moodtracker | cat
