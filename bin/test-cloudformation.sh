set -euo pipefail

handle_error() {
  echo "💣 Error on line $1, exit code $2 💣"
  exit $2
}

trap 'handle_error $LINENO $?' ERR

pushd scripts > /dev/null

echo "⏳ Validating CloudFormation template... ⏳"
aws cloudformation validate-template --template-url https://moodtracker-cloudformation.s3.amazonaws.com/cloudformation.yml > /dev/null
echo "🍄 CloudFormation template validated successfully! 🍄"

echo "⏳ Running Checkov against CloudFormation template... ⏳"
# CKV_AWS_116 is skipped because lambdas are being used to process synchronous HTTP requests and a dead letter queue does not solve any known issues in that usecase (see also https://github.com/bridgecrewio/checkov/issues/1795)
# CKV_AWS_119 is skipped because AWS encrypt DynamoDB at rest with their own keys and that is deemed sufficient (see also https://github.com/bridgecrewio/checkov/issues/1473)
uv run checkov --file ../infra/cloudformation.yml --skip-check CKV_AWS_116,CKV_AWS_117,CKV_AWS_119 --quiet
popd > /dev/null
echo "🍄 Checkov passed! 🍄"

echo "🍄 All CloudFormation tests pass! 🍄"
