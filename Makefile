# Compiles some basic usage analytics
analytics:
	@./bin/analytics.sh

# Generates the CloudFormation file
cloudformation:
	@echo "🍄 CloudFormation template built successfully! 🍄"
	@./bin/cloudformation.py

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
	@aws cloudformation validate-template --template-body file://infra/cloudformation.yml > /dev/null
	@echo "🍄 CloudFormation template validated successfully! 🍄"

.PHONY: analytics cloudformation deploy deploy/dry-run help init start test test/ci test/cloudformation
