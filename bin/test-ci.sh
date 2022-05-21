set -euo pipefail

handle_error() {
  echo "💣 Error on line $1, exit code $2 💣"
  exit $2
}

trap 'handle_error $LINENO $?' ERR

pushd client > /dev/null
npm run test-ci
popd > /dev/null

echo "🍄 All tests pass! 🍄"
