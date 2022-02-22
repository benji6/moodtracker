set -euo pipefail

handle_error() {
  echo "💣 Error on line $1, exit code $2 💣"
  exit $2
}

trap 'handle_error $LINENO $?' ERR

pushd scripts > /dev/null

echo "⏳ Validating CloudFormation template... ⏳"
aws cloudformation validate-template --template-body file://../infra/cloudformation.yml > /dev/null
echo "🍄 CloudFormation template validated successfully! 🍄"

echo "⏳ Running Checkov against CloudFormation template... ⏳"
poetry run checkov --file ../infra/cloudformation.yml --skip-check CKV_AWS_116
popd > /dev/null
echo "🍄 Checkov passed! 🍄"

echo "🍄 All CloudFormation tests pass! 🍄"
