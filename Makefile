# Deploy infrastructure
deploy:
	./bin/deploy.sh

# Print this help message
help:
	@echo
	@awk '/^#/ {c=substr($$0,3); next} c && /^([a-zA-Z].+):/{ print "  \033[32m" $$1 "\033[0m",c }{c=0}' $(MAKEFILE_LIST) |\
		sort |\
		column -s: -t |\
		less -R

# Install all dependencies
init:
	./bin/init.sh

# Run the project locally
start:
	./bin/start.sh

# Run all tests
test:
	./bin/test.sh

.PHONY: deploy help init start test
