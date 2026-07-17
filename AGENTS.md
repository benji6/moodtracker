# MoodTracker agent guide

## Repository overview

MoodTracker is an offline-capable React web application for tracking moods,
meditations, exercise, sleep, and related insights. The frontend is deployed
by Netlify. AWS infrastructure and APIs are defined with Troposphere-generated
CloudFormation; Firebase configuration, secrets, and a few unsupported AWS
resources are managed outside this repository.

## Project layout

- `client/`: React 19 and TypeScript frontend, built with Parcel.
  - `src/components/`: pages, shared UI, navigation, hooks, and HOCs.
  - `src/store/`: Redux Toolkit slices and store configuration.
  - `src/router/`: React Router route configuration.
  - `src/types.ts`: event, API, and domain types.
  - `src/api.ts`, `src/cognito.ts`, and `src/firebase.ts`: browser service
    integrations.
  - `cypress/`: end-to-end tests; the application must run on port 1234.
- `scripts/`: Python operational scripts and CloudFormation source.
  - `cloudformation/`: Troposphere resource definitions and Lambda handlers.
  - `cloudformation/main.py`: generates `infra/cloudformation.yml`.
- `infra/cloudformation.yml`: generated CloudFormation template. Do not edit it
  directly; modify `scripts/cloudformation/` and regenerate it.
- `bin/`: deployment and CloudFormation test scripts.

## Setup and commands

- Use Node.js 24, as specified by `client/.nvmrc`.
- Install all dependencies with `make init`; CI only installs frontend
  dependencies with `make init/ci`.
- Start the frontend with `make start`.
- Run CI-equivalent frontend validation with `make test/ci`.
- From `client/`, use focused commands when appropriate:
  - `npm run test:unit`
  - `npm run test:types`
  - `npm run test:lint`
  - `npm run test:fmt`
- Run end-to-end tests with `npm run test:e2e` only while the local application
  is running and test-user credentials are configured.
- Regenerate and validate infrastructure with `make cloudformation/test`. This
  uses AWS credentials and uploads the template, so do not run it merely for
  local source-only changes. To regenerate the checked-in template without
  validation, run `cd scripts && uv run python3 cloudformation/main.py`.
- Python dependencies are managed by `uv` in `scripts/`; run scripts through
  `uv run`.

## Frontend conventions

- TypeScript is strict and rejects unused locals. Keep type safety intact and
  avoid `any` unless an external API requires a documented, localized
  workaround.
- Follow the existing React, Redux Toolkit, React Query, React Router, Eri,
  and CSS patterns. Keep application state in the existing slices and
  server/cache state in React Query where applicable.
- Event payload types are versioned in `client/src/types.ts`. Coordinate
  frontend event-type changes with the corresponding backend Lambda handling
  and preserve backward compatibility for stored events.
- The app persists data in browser storage and registers a service worker.
  Treat storage keys, cache persistence, and synchronization behavior as
  compatibility-sensitive.
- Use sentence case for all user-facing UI copy, except proper nouns and the
  first word of a sentence.
- Prefer self-explanatory code. Add comments only for non-obvious business
  rules, compatibility workarounds, performance decisions, or algorithms.
- Use `npm run icons` from `client/` to regenerate version-controlled icons
  after changing icon-generation inputs.

## Infrastructure and deployment

- CloudFormation changes belong in the Troposphere source under
  `scripts/cloudformation/`, followed by regeneration of
  `infra/cloudformation.yml`.
- Treat deployment commands as production-affecting. `make deploy` creates a
  CloudFormation change set; review it before executing it. API source changes
  require a separate API Gateway deployment, using the
  `ApiGatewayDeployCommand` stack output.
- Do not add credentials, tokens, user data, or other secrets to source,
  templates, fixtures, or logs.

## Keeping this guide current

Update this `AGENTS.md` whenever a change adds, removes, or materially changes
repository structure, architecture, development commands, test workflows,
deployment behavior, generated artifacts, or project-wide conventions. Keep
the guidance concise, accurate, and limited to durable information agents need
to work safely and effectively.
