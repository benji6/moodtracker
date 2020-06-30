# MoodTracker

[![Netlify Status](https://api.netlify.com/api/v1/badges/0d744c93-11e8-4072-85e2-4a168c1ae8ae/deploy-status)](https://app.netlify.com/sites/benji6-moodtracker/deploys)

## About

MoodTracker is a free and open source web app that lets you track your mood. It's simple to use, works offline and because it runs in your browser you can use it across all your devices!

The MoodTracker UI was built using a component library I made called [Eri](https://github.com/benji6/eri).

## Getting started

### Install dependencies

```sh
make init
```

### Test

```sh
make test
```

### Run

```sh
make start
```

### Deploy

#### Backend and infrastructure

Infrastructure is managed with AWS CloudFormation.

```sh
make deploy
```

**N.B. making changes to the API doesn't trigger a new deployment, but you can trigger a manual deployment by copying the value of the `ApiGatewayDeployCommand` output and running that.**

#### UI

Master is automatically deployed with [Netlify](http://netlify.com).

**N.B. because icons take a long time to generate and do not change often they are created from the master svg file by running `yarn icons` in the `/client` dir and committed to version control.**
