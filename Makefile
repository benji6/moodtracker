# Compiles some basic usage analytics
analytics:
	@cd scripts && poetry run python3 ./analytics.py

# Generates the CloudFormation file
infra/cloudformation.yml: scripts/cloudformation/*.py scripts/cloudformation/**/*.py
	@cd scripts && poetry run python3 cloudformation/main.py
	@echo "🍄 CloudFormation template built successfully! 🍄"

# Builds and validates the CloudFormation template
cloudformation/test: infra/cloudformation.yml
	@aws s3 cp --quiet infra/cloudformation.yml s3://moodtracker-cloudformation
	@echo "🍄 CloudFormation template uploaded to S3 successfully! 🍄"
	@./bin/test-cloudformation.sh

# Deploy infrastructure
deploy: cloudformation/test
	@./bin/deploy.sh

# Deployment dry run to view potential changes
deploy/dry-run: cloudformation/test
	@aws cloudformation deploy --capabilities CAPABILITY_IAM --no-execute-changeset --s3-bucket moodtracker-cloudformation --stack-name moodtracker --template-file infra/cloudformation.yml

# Print this help message
help:
	@echo
	@awk '/^#/ {c=substr($$0,3); next} c && /^([a-zA-Z].+):/{ print "  \033[32m" $$1 "\033[0m",c }{c=0}' $(MAKEFILE_LIST) |\
		sort |\
		column -s: -t |\
		less -R

# Install all dependencies
init: init/ci
	@cd scripts && echo "⏳ Installing Python dependencies... ⏳" && poetry install && echo "🍄 Python dependencies successfully installed! 🍄"

# Install all Node.js dependencies
init/ci:
	@cd client && echo "⏳ Installing Node.js dependencies... ⏳" && npm i && echo "🍄 Node.js dependencies successfully installed! 🍄"

# Updates the CloudFormation stack policy
stack-policy:
	@aws cloudformation set-stack-policy --stack-name moodtracker --stack-policy-body file://infra/stack-policy.json | cat
	@echo "🍄 CloudFormation stack policy updated successfully! 🍄"

# Run the project locally
start:
	@cd client && npm start

# Run all tests
test: cloudformation/test
	@./bin/test.sh

# Runs all CI tests (CloudFormation checks and e2e tests not yet supported)
test/ci:
	@cd client && npm run test-ci && echo "🍄 All tests pass! 🍄"

.PHONY: analytics cloudformation/test deploy deploy/dry-run help init init/ci stack-policy start test test/ci
