set -euo pipefail

handle_error() {
  echo "💣 Error on line $1, exit code $2 💣"
  exit $2
}

trap 'handle_error $LINENO $?' ERR

pushd scripts > /dev/null
poetry run python3 cloudformation/main.py
popd > /dev/null
