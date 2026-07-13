# Static Coolify deploy - Tasks

## T-001 - Replace Compose with the canonical Dockerfile deploy

- Specialist: devops
- Model: gpt-5.5, high reasoning
- Depends On: none
- Expected Files: `frontend/Dockerfile`, `frontend/.dockerignore`, `frontend/nginx.conf`, deleted Compose files
- BDD / Acceptance Criteria: production image builds and serves the SPA on port 80 without a shared network
- RED: current public request returns 504; Compose declares `rafael-network`
- GREEN: Dockerfile image builds and internal HTTP smoke test returns 200
- REFACTOR: keep one canonical production build path
- Verification: `docker build -t technical-portfolio:verify ./frontend`
- Done: image builds; container healthcheck, `/`, and `/projects` smoke tests pass

## T-002 - Update canonical deployment documentation

- Specialist: documentation
- Model: gpt-5.4-mini, low reasoning
- Depends On: T-001
- Expected Files: `readme.md`, SDD files
- BDD / Acceptance Criteria: README documents Dockerfile settings and contains no Compose deployment guidance
- RED: README currently directs Coolify and local users to Compose
- GREEN: final search finds no deployment references to Docker Compose
- REFACTOR: keep operational settings in one concise section
- Verification: `rg -n -i "docker compose|docker-compose|rafael-network" readme.md`
- Done: README and SDD updated; operational Compose guidance removed

## T-003 - Publish and migrate Coolify production resource

- Specialist: devops
- Model: gpt-5.5, high reasoning
- Depends On: T-001, T-002
- Expected Files: Git commit; Coolify Dockerfile application configuration
- BDD / Acceptance Criteria: both portfolio domains return HTTP 200 through Traefik
- RED: public endpoint returns Cloudflare 504
- GREEN: Dockerfile deployment is healthy and public smoke test returns 200
- REFACTOR: remove or stop obsolete Compose resource after successful cutover
- Verification: `curl -fsSI https://rafaelmarin.dev/`
- Done: Coolify resource migrated to Dockerfile, deployment `ao5xm6vnoj3o0eyat0cdcdcu` finished healthy, and `/`, `/projects`, `/blog`, and `www` returned HTTP 200
