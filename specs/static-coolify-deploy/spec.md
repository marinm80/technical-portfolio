# Static Coolify deploy - Functional Spec

## Problem

The production portfolio returns a 504 because its Compose service is attached to both the Coolify application network and `rafael-network`, while Traefik does not pin the backend network. The portfolio is a static SPA and does not need Compose or direct Docker connectivity to WordPress.

## Scope

- Deploy the portfolio from a single multi-stage Dockerfile.
- Serve the built SPA with Nginx on port 80.
- Consume the blog through its public HTTPS API.
- Remove Compose files and shared-network configuration.
- Document the canonical Coolify configuration and local image commands.

## Out Of Scope

- Changes to the WordPress blog or its database.
- Changes to portfolio content, routes, authentication, or EmailJS behavior.
- New runtime dependencies.

## Actors

- Visitor: opens `rafaelmarin.dev` and navigates the SPA.
- Operator: deploys the application in Coolify and configures build variables.

## User Stories

- As a visitor, I can load the portfolio without a gateway timeout.
- As an operator, I can deploy the portfolio using only `frontend/Dockerfile`.
- As the SPA, I can fetch blog posts from the public WordPress API without a shared Docker network.

## BDD Scenarios

```gherkin
Feature: Static Coolify deploy

  Scenario: Build the static production image
    Given the repository is checked out
    When the frontend Dockerfile is built
    Then the build succeeds
    And the runtime image serves the SPA on port 80

  Scenario: Navigate directly to a client-side route
    Given the production container is running
    When a visitor requests a valid SPA route directly
    Then Nginx returns index.html successfully

  Scenario: Deploy without a shared Docker network
    Given Coolify uses the Dockerfile build pack
    When the application is deployed
    Then Traefik can reach the container on the Coolify application network
    And no rafael-network configuration is required
```

## Acceptance Criteria

- `docker-compose.yml` and `docker-compose.local.yml` are absent.
- `frontend/Dockerfile` produces a healthy Nginx image exposing port 80.
- README contains the Dockerfile-based Coolify settings and no Compose deployment instructions.
- Lint, typecheck, unit tests, and production build pass.
- `https://rafaelmarin.dev` returns HTTP 200 after the Coolify migration.
