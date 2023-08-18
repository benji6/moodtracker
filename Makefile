# Compiles some basic usage analytics
analytics:
	@cd scripts && poetry run python3 ./analytics.py

# Makes notifications_send.zip
scripts/cloudformation/lambdas/notifications_send.zip: scripts/cloudformation/lambdas/notifications_send/*
	@cd scripts/cloudformation/lambdas/notifications_send &&\
		mkdir -p package &&\
		pip install -r requirements.txt --target ./package > /dev/null
	@echo "🍄 notifications_send dependencies installed successfully! 🍄"
	@cd scripts/cloudformation/lambdas/notifications_send/package &&\
		rm -r __pycache__ &&\
		zip -r ../../notifications_send.zip . > /dev/null &&\
		cd .. &&\
		zip ../notifications_send.zip index.py > /dev/null
	@echo "🍄 notifications_send.zip made successfully! 🍄"

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
deploy: cloudformation/test deploy/notifications_send
	@./bin/deploy.sh

# Deployment dry run to view potential changes
deploy/dry-run: cloudformation/test
	@aws cloudformation deploy --capabilities CAPABILITY_IAM --no-execute-changeset --s3-bucket moodtracker-cloudformation --stack-name moodtracker --template-file infra/cloudformation.yml

deploy/notifications_send: scripts/cloudformation/lambdas/notifications_send.zip
	@aws s3 cp --quiet scripts/cloudformation/lambdas/notifications_send.zip s3://moodtracker-cloudformation/lambdas/notifications_send.zip
	@echo "🍄 notifications_send.zip uploaded to S3 successfully! 🍄"
	@aws lambda update-function-code --function-name MoodTrackerWebNotificationsSend --s3-bucket moodtracker-cloudformation --s3-key lambdas/notifications_send.zip > /dev/null
	@echo "🍄 MoodTrackerWebNotificationsSend lambda updated successfully! 🍄"

# Print this help message
help:
	@echo
	@awk '/^#/ {c=substr($$0,3); next} c && /^([a-zA-Z].+):/{ print "  \033[32m" $$1 "\033[0m",c }{c=0}' $(MAKEFILE_LIST) |\
		sort |\
		column -s: -t |\
		less -R

# Install all dependencies
init: init/ci
	@echo "⏳ Installing Python dependencies... ⏳"
	@cd scripts && poetry install
	@echo "🍄 Python dependencies successfully installed! 🍄"

# Install all Node.js dependencies
init/ci:
	@echo "⏳ Installing Node.js dependencies... ⏳"
	@cd client && npm i
	@echo "🍄 Node.js dependencies successfully installed! 🍄"

# Updates the CloudFormation stack policy
stack-policy:
	@aws cloudformation set-stack-policy --stack-name moodtracker --stack-policy-body file://infra/stack-policy.json | cat
	@echo "🍄 CloudFormation stack policy updated successfully! 🍄"

# Run the project locally
start:
	@cd client && npm start

# Run all tests
test: cloudformation/test
	@cd client && npm t && echo "🍄 All tests pass! 🍄"

# Runs all CI tests (CloudFormation checks and e2e tests not yet supported)
test/ci:
	@cd client && npm run test-ci && echo "🍄 All tests pass! 🍄"

.PHONY: analytics cloudformation/test deploy deploy/dry-run deploy/notifications_send help init init/ci stack-policy start test test/ci
