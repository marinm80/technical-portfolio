# Static Coolify deploy - Architecture Plan

## Data Model Checkpoint

Status: not applicable. This change has no data model or persistence changes.

## Architecture

GitHub push triggers a Coolify Dockerfile build. Coolify uses `/frontend` as the build context and `/Dockerfile` as the Dockerfile location. Node builds the Vite assets; Nginx serves them on port 80; Coolify's Traefik proxy terminates TLS and routes both portfolio domains to the container.

## API Contracts

- WordPress: browser-to-`https://blog.rafaelmarin.dev/wp-json/...` over HTTPS.
- EmailJS: browser-to-EmailJS public API over HTTPS.
- No internal container-to-container API contract.

## Folder Structure

- `frontend/Dockerfile`: canonical production build and runtime.
- `frontend/.dockerignore`: constrained Docker build context.
- `frontend/nginx.conf`: SPA routing and static response policy.
- `readme.md`: canonical local and Coolify deployment guide.
- `specs/static-coolify-deploy/`: decision and verification record.

## ADR-Lite Decisions

1. Use one Dockerfile instead of Compose because the application has one runtime process.
2. Do not attach `rafael-network`; public browser APIs do not require Docker DNS or network access.
3. Keep Nginx rather than Coolify's generic static build pack to preserve the existing SPA fallback, CSP, security headers, and caching policy.
4. Keep Vite variables as Docker build arguments because they are compiled into the browser bundle.

## D-09 Testability And AI-TDD By Layer

- Frontend regression: lint, TypeScript, Vitest, Vite build.
- Image: Docker build plus container healthcheck.
- Routing: HTTP smoke test for `/` and a direct SPA route.
- Production: HTTP 200 through Cloudflare/Traefik and absence of 504.

## Risks

- Coolify's existing Compose resource cannot safely deploy after Compose files are removed. Mitigation: migrate or recreate the resource as Dockerfile before treating the deployment as complete.
- Missing build-variable flags produce an empty blog/contact configuration. Mitigation: preserve and verify `VITE_*` values in Coolify.
- Domain overlap between old and new resources can create ambiguous Traefik routing. Mitigation: move domains atomically and stop the old resource after the Dockerfile deployment is healthy.
