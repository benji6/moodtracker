# MoodTracker

![CI](https://github.com/benji6/moodtracker/workflows/CI/badge.svg)
[![Netlify Status](https://api.netlify.com/api/v1/badges/0d744c93-11e8-4072-85e2-4a168c1ae8ae/deploy-status)](https://app.netlify.com/sites/benji6-moodtracker/deploys)

## About

MoodTracker is a free and open source web app app that aims to help you understand yourself better. Track your emotional landscape, keep a mood journal and a meditation log and gain new insights into yourself. It's simple to use, works offline and because it runs in your browser you can use it across all your devices!

[Check it out here](https://moodtracker.link)

The MoodTracker UI was built using a component library I made called [Eri](https://github.com/benji6/eri).

## Getting started

### Install dependencies

```sh
make init
```

### Run

```sh
make start
```

### Test

You will need to be running the client locally on the default port for the end-to-end tests to pass and you will need credentials for a registered user on the platform that you can use to set the `MOODTRACKER_TEST_USER_EMAIL` and `MOODTRACKER_TEST_USER_PASSWORD` environment variables.

```sh
make test
```

### Deploy

#### Backend and infrastructure

Majority of the infrastructure is managed with AWS CloudFormation (a few things that aren't well supported have been done manually).

```sh
make deploy
```

**N.B. making changes to the API doesn't trigger a new deployment, but you can trigger a manual deployment by copying the value of the `ApiGatewayDeployCommand` output and running that.**

#### UI

Continuously deployed with [Netlify](http://netlify.com).

##### N.B.

- Because icons take a long time to generate and do not change often they are created from the master SVG file by running `yarn icons` in the `/client` dir and committed to version control.
