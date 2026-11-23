# Diagnóstico de migración (Fase 1 · solo lectura) · technical-portfolio · 2026-11-21

Ejecutor: `project-scanner` (dominio Migración, SDD v5). Skill: `project-scan` (PS-01..05), `legacy-sdd-format`, `common-security`. Alcance: solo lectura (MI-01). Artefactos generados:

- `docs/reports/migrations/2026-11-21_inventario.json`
- `docs/reports/migrations/2026-11-21_inventario.md`
- este archivo

## 0. Control de solo lectura (MI-01)

- `git status` antes y después del escaneo: idéntico (branch `main`, en paralelo con `origin/main`, commit `749b964`). Único cambio: archivos nuevos en `docs/reports/migrations/` — evidencia: salida de `git status` al final de este informe.
- Nota de proceso: la primera invocación de `scan_project.py` se corrió desde Bash con `--out docs\reports\migrations`; Bash interpretó las barras invertidas como escapes y creó `./docsreportsmigrations/`. Se movieron los dos archivos generados a la ruta correcta (`docs/reports/migrations/`) y se borró el directorio mal nombrado — operación de corrección sobre mi propio artefacto de salida, no sobre código del proyecto. Evidencia: `mkdir -p docs/reports/migrations && mv docsreportsmigrations/*.{json,md} docs/reports/migrations/ && rmdir docsreportsmigrations`.
- `.claude/` y `.impeccable/` quedan sin trackear, confirmados por el enunciado de la tarea como configuración local de herramientas (no se tocaron).

## 1. Resumen del stack (evidencia: `2026-11-21_inventario.json`, `frontend/package.json`)

| Capa | Detalle |
|---|---|
| Tipo de proyecto | SPA estática, sin backend propio |
| UI | React `^19.2.5`, React Router `^7.15.0`, Framer Motion `^12.38.0`, lucide-react |
| Lenguaje | TypeScript `~6.0.2` (`strict: true` — `frontend/tsconfig.app.json`) |
| Build | Vite `^8.0.10` (`frontend/vite.config.ts`) |
| Estilos | Tailwind CSS `^4.3.0` |
| Formularios | React Hook Form `^7.75.0` + Zod `^4.4.3` (`frontend/src/pages/Contact.tsx:13-19`) |
| i18n | i18next `^26.0.10` + react-i18next `^17.0.7` + language-detector `^8.2.1` (`frontend/src/i18n.ts`) |
| Testing | Vitest `^4.1.5` + Testing Library `^16.3.2` + jsdom `^29.1.1` |
| CI | GitHub Actions, `.github/workflows/ci.yml`: `npm ci` → ESLint → `tsc -b` → `npm test` → `vite build`, Node `22.x` fijado solo en el workflow |
| Deploy | `frontend/Dockerfile` multi-stage (`node:22-alpine` → `nginx:alpine`), Coolify Dockerfile build pack, Traefik termina TLS |
| Runtime pins en el repo | Ninguno (`inv["runtime_pins"] = {}`; no hay `.nvmrc`/`.node-version`; `engines` es `null` en ambos `package.json`) |
| BD | Ninguna (`specs/static-coolify-deploy/tech-spec.md:9-11`: "Database: None. The portfolio has no server-side persistence.") |
| Lockfiles | `frontend/package-lock.json` (único; el `package.json` raíz no tiene dependencias ni scripts) |
| Lenguajes por líneas | TypeScript 41 archivos/2619 líneas, CSS 1/56, HTML 1/45, JavaScript 1/29 (inventario JSON) |

Integraciones externas detectadas (evidencia de código):
- WordPress REST API pública (`frontend/src/services/wordpress.ts:35-120`), vía `fetch` a `${VITE_WP_API_URL}/wp-json/wp/v2/...`, con validación de contrato en runtime con Zod.
- EmailJS (`@emailjs/browser`, `frontend/src/services/email.ts:1-31`), claves públicas por diseño (ver `.env.example:11-15`).
- Google Fonts (`frontend/index.html:37-39`, Inter + Fira Code).
- `schema.org/Person` JSON-LD para SEO (`frontend/src/components/PersonJsonLd.tsx`).
- CSP declarada en `frontend/nginx.conf:37` restringe `connect-src` a `'self' https://api.emailjs.com https://blog.rafaelmarin.dev`, coherente con las dos integraciones de arriba.

## 2. Mapa de capacidades (PS-03)

| Punto de entrada | Lee | Escribe / efecto | Llamadas externas | Reglas de negocio visibles |
|---|---|---|---|---|
| `GET /` → `Home.tsx` | `src/data/profile.ts` | — | ninguna | Bio + CTA; sin datos remotos |
| `GET /projects` → `Projects.tsx` | `src/data/projects.ts`, `locales/*.ts` | — | ninguna (links salientes a GitHub/demos en vivo) | Botón "GitHub" solo si el proyecto tiene `github`; nunca enlaces placeholder `#` (cubierto por `Projects.test.tsx`) |
| `GET /blog` → `Blog.tsx` | — | — | `GET {VITE_WP_API_URL}/wp-json/wp/v2/categories` y `/posts` (`services/wordpress.ts:52-74`) | Sin `VITE_WP_API_URL`, `isBlogConfigured()` fuerza estado vacío "Próximamente" en vez de error (degradación honesta) |
| `GET /contact` → `Contact.tsx` | `src/data/profile.ts` | Envía email vía EmailJS | `emailjs.send(...)` → API pública de EmailJS (`services/email.ts:23-31`) | Sin credenciales EmailJS, `isEmailConfigured()` fuerza fallback `mailto:`; validación Zod (nombre ≥2, email válido, mensaje ≥10) con re-trigger al cambiar idioma (`Contact.tsx:44-49`) |
| `GET /experience`, nav, Home CTA | — | — | ninguna | Ruta deshabilitada: `App.tsx:16-22` no la registra y ya no hace match; `Navigate to="/"` captura cualquier ruta desconocida. Comentario explícito en `App.tsx:17-19` sobre cómo reactivarla. Datos de `src/data/experience.ts` y traducciones siguen en el bundle (confirmado por el inventario de comentarios: `TODO(rafael)` en `experience.ts:6`, `locales/en.ts:40`, `locales/es.ts:35`) |
| `npm run dev\|build\|preview\|lint\|test\|test:coverage` | — | build a `frontend/dist/` | — | Scripts estándar de Vite/Vitest (`frontend/package.json:7-14`) |
| `.github/workflows/ci.yml` (push/PR a `main`) | checkout | — | ninguna externa salvo registries npm | Gate de CI: lint → typecheck → test → build, sin deploy automático |
| `frontend/Dockerfile` (build de imagen) | `ARG VITE_*` | imagen `nginx:alpine` con `dist/` | ninguna en build (variables ya resueltas) | Vite inyecta `VITE_*` en build-time; sin ellas, modo degradado (comentario `Dockerfile:4-5`) |
| Theming (`ThemeContext.tsx`) | `localStorage.theme`, `prefers-color-scheme` | escribe `localStorage.theme`, clase `.dark` en `<html>` | ninguna | Oscuro por defecto salvo que el SO prefiera claro |
| i18n (`i18n.ts`) | `localStorage`, `navigator` | escribe `localStorage`, `document.documentElement.lang` | ninguna | Fallback `es`; soporta `es`/`en` con normalización de variantes regionales |

No hay jobs, colas ni cron: es una SPA 100% cliente sin servidor propio.

## 3. Clasificación del escenario (PS-04)

**Escenario: sitio estático/frontend sin backend, con tests y documentación — "docs que divergen parcialmente del código" + proyecto ya en formato SDD (parcial).** Evidencia:

- **Sin backend confirmado**: `inv["php"] = []`, `inv["python"] = []`, `inv["wordpress"] = false` (el WordPress es un servicio *externo* consumido por HTTP, no parte de este repo); `tech-spec.md:9-11` lo declara explícitamente ("Database: None").
- **Con tests**: 14 archivos de test (`inv["tests"]["test_files"] = 14`), cobertura declarada en `readme.md:79` ("81 tests"). Al ejecutar la suite en este entorno (`cd frontend && npm test`), **72 de 83 tests fallan** con `TypeError: Cannot read properties of undefined (reading 'getItem')` sobre `localStorage` dentro de jsdom (`ThemeContext.tsx:12`, ver más abajo en Hallazgos — probable incompatibilidad de entorno, no bug de producto, porque `tsc -b` y `eslint .` sí pasan limpios).
- **Docs que divergen del código**: `docs/project-documentation.md` (693 líneas) describe una navegación con "Home / Experience / Projects / Blog" y una ruta `/experience` activa (`project-documentation.md:64,115,277,287,331-333`), pero el código actual (`App.tsx:16-22`, `Sidebar.tsx:58-63`) tiene esa ruta deshabilitada y fuera del nav — divergencia confirmada entre documentación y estado real.
- **Formato SDD anterior, parcial**: existe `specs/static-coolify-deploy/` con `spec.md`, `tech-spec.md`, `plan.md`, `tasks.md` y `.state.json` ya en fase `"done"` con checkpoints aprobados — **no** es el formato v3 descrito por `legacy-sdd-format` (`next_agent`, `implementation`, etc.); su esquema (`phase`, `approved_checkpoints`, `completed_tasks`) es compatible con v4/v5. No requiere conversión de máquina de estados.
- El directorio `.claude/` detectado por el escáner como "SDD anterior" (`inv["legacy_sdd"] = [".claude"]`) **no contiene agentes ni skills**: solo `launch.json`, una configuración de depuración de editor (`runtimeExecutable: npm`, puerto 5180). Es un falso positivo del escáner para los fines de `legacy-sdd-format` (ese skill busca `.claude/agents`, `.claude/skills`), y además no está trackeado por git (confirmado por el contexto de la tarea). No se requiere migración LF-01..04 sobre este directorio.
- **Ausencia de `docs/reports` y `docs/comments` previos**: `inv["sdd_v5"] = {"docs_reports": false, "docs_comments": false, "gitignore_comments": false}` antes de este escaneo (ahora `docs/reports/` existe por este propio diagnóstico). `docs/comments/` y la entrada correspondiente en `.gitignore` siguen sin existir — gap frente a la regla "Cada proyecto tiene `docs/reports/` (versionado) y `docs/comments/` (ignorado por git)".

## 4. Secretos: repo, historial y limitación de herramientas

`gitleaks` y `knip` **no están instalados** en este entorno (verificado): `which gitleaks` → `command not found`; `npx knip --version` → cancelado por paquete faltante sin `-y`. No se ejecutaron. Alternativa aplicada manualmente, con evidencia:

1. **`.env` tracking**: `.env` y `.env.*` están en `.gitignore` (raíz y `frontend/`, con excepción `!.env.example`). `git ls-files | grep -i "\.env"` solo devuelve `.env.example` y `frontend/.env.example`. `git log --all --full-history -- .env frontend/.env` no devuelve commits. El propio `scan_project.py` corrobora: `secret_candidates.count = 0` y su chequeo específico de `.env` trackeado no disparó ningún hit.
2. **Grep de patrones típicos en archivos trackeados** (`git grep -nIE "(api[_-]?key|secret|password|token|connection[_-]?string|AKIA...|BEGIN...PRIVATE KEY|mongodb://|postgres://|mysql://)"`): sin coincidencias reales. Los únicos hits son falsos positivos: texto descriptivo sobre otro proyecto del portafolio ("password recovery" en `frontend/src/locales/en.ts:75`, que describe el proyecto *Taskly*, no una credencial de este repo) y la palabra "token" dentro de `package-lock.json` (nombres de paquetes npm como `js-tokens`, `css-tokenizer`).
3. **Historial completo** (`git log --all -p -- .` filtrado por los mismos patrones, más `VITE_EMAILJS_PUBLIC_KEY=[A-Za-z0-9_-]`): únicas coincidencias son placeholders de documentación (`tu_public_key`, `tu_public_key_aqui`) en commits previos de `readme.md`/`docs`, nunca un valor real.
4. **Nombres de archivo sospechosos en todo el historial** (`git log --all --diff-filter=A --name-only`, filtrado por `\.env|secret|credential|\.pem|\.key|\.p12|\.pfx`): solo `.env.example` y `frontend/.env.example` existieron alguna vez.
5. El `.env` local (fuera de git) sí contiene valores reales de EmailJS (`service_bo4om2w`, `template_bzhd93a`, `lMcAF-K-U_uY4ipD9`). Esto es consistente con el diseño documentado: EmailJS usa claves **públicas** por diseño (`frontend/.env.example:11-15`; `readme.md:74`); la protección real es el allowlist de dominios en el dashboard de EmailJS, no el secreto de la clave. No se trata como incidente (LF-03 no aplica: nunca estuvo en el repo ni en commits).
6. El "posible sensible" que reportó `scan_project.py` (`possibly_sensitive: 1` en el conteo de comentarios) se verificó manualmente: es un comentario CSS en `frontend/src/index.css:5` que dice *"Tokens semánticos: las utilidades..."* — coincide con la palabra "token" del patrón regex, no es una credencial. Falso positivo confirmado reproduciendo la misma regex del escáner contra el texto completo de cada comentario.

**Conclusión de secretos**: sin evidencia de credenciales reales en el repo ni en el historial completo. Confirmar formalmente con `gitleaks detect --redact` (repo) y `gitleaks detect --log-opts="--all" --redact` (historial) cuando la herramienta esté disponible, antes de dar por cerrado el punto en una fase posterior (PS-02).

## 5. Hallazgos (PS-05) — catalogados, sin corregir (MI-01)

| # | Hallazgo | Severidad | Evidencia |
|---|---|---|---|
| H1 | La suite de tests falla casi por completo en este entorno (72/83) por `TypeError` en `localStorage` dentro de jsdom, mientras `tsc -b` y `eslint .` pasan limpios. Ningún `engines`/`.nvmrc` fija la versión de Node (`inv["runtime_pins"] = {}`, `engines: null` en ambos `package.json`); CI fija Node `22.x` pero el entorno local donde se corrió este diagnóstico tiene Node `v26.13.1` instalado. Alta probabilidad de incompatibilidad jsdom/Node, no de un bug de producto. | **Alta** (bloquea verificación local reproducible de la suite; riesgo de que cualquier ejecutor posterior "vea" una suite rota que en CI real no lo está) | `npm test` (ver `evidence` de esta sesión): 10 de 12 archivos de test fallan con el mismo stack trace (`ThemeContext.tsx:12:31`); `node --version` → `v26.13.1`; `.github/workflows/ci.yml:20-23` fija `node-version: '22.x'`; `readme.md:55` declara "Requisitos: Node.js 22" |
| H2 | `docs/project-documentation.md` (693 líneas) describe una navegación y una ruta `/experience` activas que ya no existen en el código corriente. | **Media** (riesgo de que un agente de migración posterior use este documento como fuente de verdad y reintroduzca una ruta intencionalmente deshabilitada, o pierda tiempo reconciliando) | `docs/project-documentation.md:64,115,277,287,331-333` vs. `frontend/src/App.tsx:16-22` (ruta ausente) y `frontend/src/components/Sidebar.tsx:58-63` (nav sin "Experiencia") |
| H3 | Datos y traducciones de la sección "Experiencia" deshabilitada siguen compilándose en el bundle de producción (código muerto accesible, no solo deshabilitado en runtime), incluyendo contenido marcado como placeholder. | **Media** (deuda técnica + contenido ficticio en el bundle público; ya señalado por una auditoría previa del propio proyecto) | `frontend/src/data/experience.ts:6` (`// TODO(rafael): contenido placeholder — reemplazar con experiencia laboral real.`), mismos TODO en `frontend/src/locales/en.ts:40` y `es.ts:35`; corroborado por `.impeccable/critique/2026-07-20T14-07-17Z__frontend.md:87` ("Dormant `experience.items` placeholder data... still ships in the JS bundle") |
| H4 | Política CC (cero comentarios) no se cumple: 127 hallazgos de comentarios en código fuente (122 notas `CC-01`, 3 `TODO` `CC-03`, 2 directivas de lint sin nota `CC-E2`), repartidos en `frontend/src/**`. Es deuda previa a la adopción formal de SDD v5 en este proyecto (no se corrige en esta fase). | **Media** (gap de cumplimiento documentado, no bloqueante para migración pero debe entrar al backlog de limpieza) | `docs/reports/migrations/2026-11-21_inventario.md` sección "Comentarios"; ejemplos concretos: `frontend/src/services/email.ts:29`, `frontend/src/services/wordpress.ts:34,48,72,76-81`, `frontend/src/App.tsx:17-19`, `frontend/src/i18n.ts:17,27-29` |
| H5 | Ausencia de `docs/comments/` (y de su entrada en `.gitignore`) y de `docs/reports/` previos al presente diagnóstico — gap frente a la regla de gobierno "todo proyecto tiene `docs/reports/` versionado y `docs/comments/` ignorado". | **Baja** (fácil de remediar con `new-project.ps1`, no bloquea la migración) | `inv["sdd_v5"] = {"docs_reports": false, "docs_comments": false, "gitignore_comments": false}` (antes de este escaneo); `.gitignore` sin entrada `docs/comments` |
| H6 | `PersonJsonLd.tsx` usa `dangerouslySetInnerHTML` para inyectar JSON-LD. El contenido proviene únicamente de `src/data/profile.ts` (constantes internas, sin entrada de usuario), por lo que el riesgo de XSS es bajo, pero el patrón merece quedar documentado para cualquier cambio futuro que añada datos dinámicos a ese componente. | **Baja** (riesgo real bajo hoy; riesgo futuro si se añaden datos dinámicos) | `frontend/src/components/PersonJsonLd.tsx:9-23` |
| H7 | El `package.json` de la raíz del repo no declara scripts ni dependencias (`{"name": "technical-portfolio", "version": "1.0.0", "private": true}`); toda la app vive en `frontend/`. No es un monorepo con workspaces — cualquier automatización o agente que asuma comandos en la raíz (`npm test`, `npm run build`) fallará silenciosamente (0 scripts) si no hace `cd frontend` primero. | **Baja** (documentado correctamente en `readme.md`, pero es una trampa fácil para tooling genérico) | `package.json` raíz; `inv["node"][0] = {"scripts": []}` |
| H8 | El directorio `.claude/launch.json` fue clasificado automáticamente por el escáner genérico como "formato SDD anterior" (coincide por nombre de carpeta), pero es solo config de lanzamiento de depurador de editor, sin agentes ni skills. Falso positivo de clasificación a corregir en el propio `scan_project.py` o en la interpretación manual (ya corregido aquí). | **Baja** (no requiere acción de migración; riesgo de que un ejecutor futuro pierda tiempo aplicando `legacy-sdd-format` innecesariamente) | `.claude/launch.json` (único archivo, contenido: config de depurador npm run dev); `.claude/` no trackeado en git (confirmado por `git status` en contexto de tarea) |
| H9 | Hallazgos de una auditoría de diseño previa del propio proyecto (`.impeccable/critique/2026-07-20T14-07-17Z__frontend.md`, P1×3, P2×2) — verificado en esta sesión que los 3 P1 (re-traducción de errores del formulario de contacto, `lang` dinámico del documento, doble `<h1>`) y los 2 P2 (foco de teclado en drawer móvil cerrado, enlaces de tarjetas de blog sin nombre accesible) **ya están resueltos** en el código actual. Se documenta solo como contexto histórico; no es un hallazgo nuevo. | **Informativo** | `frontend/src/pages/Contact.tsx:44-49` (re-trigger de validación), `frontend/src/i18n.ts:30-33` (`document.documentElement.lang` dinámico), `frontend/src/components/Sidebar.tsx:88-89` (nombre como `<p>`, no `<h1>`), `Sidebar.tsx:42-46,48-56` (inert + Escape), `git log` commit `d458f91` ("Fix 2 P2s from design critique: mobile drawer a11y, blog card links") |

No se encontró código muerto adicional más allá de H3; no se encontraron workarounds de seguridad activos (CSP, headers y gzip en `nginx.conf` están correctamente configurados para un sitio estático).

## 6. Checklist de cobertura del inventario (PS-02)

| Ítem | Cubierto | Dónde |
|---|---|---|
| Stack y versiones | Sí | Sección 1, `2026-11-21_inventario.json` |
| Estructura y módulos | Sí | Sección 2 (mapa de capacidades), `readme.md:37-51` |
| Dependencias y lockfiles | Sí | Sección 1; `frontend/package-lock.json` único lockfile |
| Tests y cobertura | Sí (con hallazgo) | Sección 3 y H1 |
| Comentarios | Sí | H4, inventario |
| Secretos (repo e historial) | Sí (alternativa manual, sin gitleaks) | Sección 4 |
| BD y migraciones | Sí (N/A) | `tech-spec.md:9-11` |
| CI/CD y despliegue | Sí | Sección 1, `.github/workflows/ci.yml`, `Dockerfile`, `nginx.conf` |
| Formato SDD anterior | Sí | Sección 3, H8 |

## Evidencia de comandos ejecutados en esta sesión (resumen)

```
python "%SDD_HOME%\tools\scan_project.py" "." --out docs\reports\migrations
which gitleaks            -> command not found
npx --no-install knip --version -> cancelado, paquete faltante
git grep -nIE "(api[_-]?key|secret|password|...)" -- .    -> sin secretos reales
git log --all --diff-filter=A --name-only | grep -iE "\.env|secret|credential|\.pem|\.key"  -> solo .env.example
git log --all -p -- . | grep -nIE "VITE_EMAILJS_PUBLIC_KEY=..."  -> solo placeholders
cd frontend && npm test        -> 72 failed, 11 passed (83) — ver H1
cd frontend && npx tsc -b      -> sin salida de error (pasa)
cd frontend && npm run lint    -> sin salida de error (pasa)
git status                     -> solo docs/reports/ como nuevo
```

## Siguiente paso sugerido

Fase 2 (gap-analysis / planificación de migración), a cargo de `migration-planner` u otro agente del dominio, usando este diagnóstico y el inventario como entrada. Recomendado: confirmar H1 con una ejecución de `npm test` en un entorno con Node 22.x antes de asumir que la suite está realmente rota.
