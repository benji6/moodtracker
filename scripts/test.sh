set -euo pipefail

aws cloudformation validate-template --template-body file://infra/cloudformation.yml | cat &
pushd client && yarn test && popd

wait
