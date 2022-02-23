# Compiles some basic usage analytics
analytics:
	@./bin/analytics.sh

# Generates the CloudFormation file
cloudformation:
	@./bin/cloudformation.py
	@echo "🍄 CloudFormation template built successfully! 🍄"

# Deploy infrastructure
deploy: test/cloudformation
	@./bin/deploy.sh

# Deployment dry run to view potential changes
deploy/dry-run: test/cloudformation
	@aws cloudformation deploy --capabilities CAPABILITY_IAM --no-execute-changeset --stack-name moodtracker --template-file infra/cloudformation.yml

# Print this help message
help:
	@echo
	@awk '/^#/ {c=substr($$0,3); next} c && /^([a-zA-Z].+):/{ print "  \033[32m" $$1 "\033[0m",c }{c=0}' $(MAKEFILE_LIST) |\
		sort |\
		column -s: -t |\
		less -R

# Install all dependencies
init:
	@./bin/init.sh

# Install all Node.js dependencies
init/ci:
	@./bin/init-ci.sh

# Updates the CloudFormation stack policy
stack-policy:
	@aws cloudformation set-stack-policy --stack-name moodtracker --stack-policy-body file://infra/stack-policy.json | cat
	@echo "🍄 CloudFormation stack policy updated successfully! 🍄"

# Run the project locally
start:
	@./bin/start.sh

# Run all tests
test: test/cloudformation
	@./bin/test.sh

# Runs all CI tests (CloudFormation checks and e2e tests not yet supported)
test/ci:
	@./bin/test-ci.sh

# Builds and validates the CloudFormation template
test/cloudformation: cloudformation
	@./bin/test-cloudformation.sh

.PHONY: analytics cloudformation deploy deploy/dry-run help init init/ci stack-policy start test test/ci test/cloudformation
