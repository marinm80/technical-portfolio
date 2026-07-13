# Static Coolify deploy - Technical Spec

## Stack

- React 19 + TypeScript + Vite 8 static SPA.
- Multi-stage `frontend/Dockerfile`: Node 22 builder and `nginx:alpine` runtime.
- Coolify Dockerfile build pack with Traefik TLS termination.

## Database

None. The portfolio has no server-side persistence.

## Auth And Permissions

No changes. The public portfolio does not add authentication or permissions.

## Non-Functional Requirements

- Container listens on port 80 and declares a local HTTP healthcheck.
- SPA fallback remains enabled in Nginx.
- Hashed assets retain immutable caching and security headers.
- WordPress and EmailJS are reached only through public HTTPS endpoints.
- No shared Docker network is attached to the portfolio.

## AI-TDD Strategy

Test-after for deployment configuration: existing application tests remain the regression suite, followed by Docker image build and HTTP smoke tests. The configuration-only RED condition is the current externally verified 504 and the presence of Compose/shared-network deployment files.

## Commands

- lint: `cd frontend && npm run lint`
- typecheck: `cd frontend && npx tsc -b`
- unit: `cd frontend && npm test`
- integration: `docker build -t technical-portfolio:verify ./frontend`
- e2e: `curl -fsS https://rafaelmarin.dev/`
- build: `cd frontend && npm run build`
- dev: `cd frontend && npm run dev`

## Specialist Hints

- Specialist: devops/frontend.
- Preserve Vite build-time variable behavior through Docker `ARG` declarations.
- In Coolify, mark each `VITE_*` environment variable as a build variable.
