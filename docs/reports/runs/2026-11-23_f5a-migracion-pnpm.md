# Informe de sesión · 2026-11-23 · F5a: Migración de npm a pnpm

## Pedido del humano

`/sdd-orchestrator quiero hacer la migracion en el proyecto de npm a pnpm, por motivos de seguridad.` (Opción B: ejecutada en esta sesión).

## Qué se hizo

1. **Rama creada:** `migr/f5-pnpm` desde `main` (`326c58e`).
2. **Generación de lockfile y configuración pnpm:**
   - `frontend/pnpm-lock.yaml` importado y generado con `pnpm import` / `pnpm install`.
   - `frontend/package-lock.json` eliminado del repositorio (`git rm`).
   - `frontend/package.json` actualizado con `"packageManager": "pnpm@12.23.0"`.
   - `frontend/.npmrc` creado con `minimum-release-age=10080` (7 días de retención de seguridad, regla SC-01).
   - `frontend/pnpm-workspace.yaml` creado con `onlyBuiltDependencies: []` (bloqueo total de scripts de instalación no autorizados, regla SC-02).
   - `frontend/.gitignore` actualizado para ignorar `.pnpm-store`.
3. **Scripts de raíz delegados a pnpm:**
   - `package.json` raíz actualizado para ejecutar `pnpm --dir frontend <script>`.
4. **Empaquetado en Docker ([`frontend/Dockerfile`](file:///C:/Users/marin/dev/projects/technical-portfolio/frontend/Dockerfile)):**
   - Instalación de pnpm en builder stage con `npm install -g pnpm@12.23.0`.
   - Copia de `package.json`, `pnpm-lock.yaml` y `.npmrc`.
   - Instalación congelada determinista: `RUN pnpm install --frozen-lockfile` (regla SC-03).
   - Build con `RUN pnpm run build`.
   - Verificado con `docker build`: empaquetado exitoso y smoke test HTTP 200 en puerto 80.
5. **CI Pipeline ([`.github/workflows/ci.yml`](file:///C:/Users/marin/dev/projects/technical-portfolio/.github/workflows/ci.yml)):**
   - Incorporación de `pnpm/action-setup@7088e561eb65bb68695d245aa206f005ef30921d` (v4.1.0, fijado por SHA, regla SC-04).
   - `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683` (v4.2.2 por SHA).
   - `actions/setup-node@1d0ff469b7ec7b3cb9d8673fde0c81c44821de2a` (v4.2.0 por SHA) con `cache: 'pnpm'` y `cache-dependency-path: ./frontend/pnpm-lock.yaml`.
   - Paso de instalación: `pnpm install --frozen-lockfile` (regla SC-03).
   - Ejecución de linters, tests, build y Playwright vía `pnpm`. Cierra además T-008.
6. **Configuración de Playwright ([`frontend/playwright.config.ts`](file:///C:/Users/marin/dev/projects/technical-portfolio/frontend/playwright.config.ts)):**
   - `webServer.command` adaptado para previsualización reproducible con Node y Vite preview sin depender de rutas globales de shell.

## Evidencia sobre `migr/f5-pnpm`

| Verificación | Comando | Resultado |
|---|---|---|
| Instalación congelada | `pnpm install --frozen-lockfile` | `Done in 54ms` · `Lockfile passes supply-chain policies` |
| Linter | `pnpm run lint` | 🟢 Exit 0 |
| Typecheck | `pnpm exec tsc -b` | 🟢 Exit 0 |
| Build producción | `pnpm run build` | 🟢 Exit 0 (471 ms) |
| Tests unitarios | `pnpm test` (con `--no-experimental-webstorage`) | 🟢 74/74 pasados (11 suites) |
| Caracterización E2E & Accesibilidad | `pnpm exec playwright test` | 🟢 55 pasados, 1 saltado (0 violaciones axe) |
| Cobertura V8 | `pnpm run test:coverage` | 🟢 88.65% líneas, 85.97% sentencias |
| Auditoría dependencias | `pnpm audit --prod` | 🟢 `No known vulnerabilities found` |
| Escaneo de secretos | `gitleaks detect --redact -v` | 🟢 72 commits analizados, 0 filtraciones |
| Dockerfile build | `docker build -t technical-portfolio:pnpm-test ./frontend` | 🟢 Exit 0 |
| Docker container test | `docker run ...` + `curl http://localhost:8089/` | 🟢 HTTP 200 OK |

## Estado

Rama `migr/f5-pnpm` lista para commit y evaluación por el Shadow correspondiente.
