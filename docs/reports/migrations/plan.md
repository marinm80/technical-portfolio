# Plan de migración a SDD v5 · technical-portfolio

Fecha: 2026-11-23 · Skill: `migration-planning` · Estado: **Gate M2 aprobado por el humano el 2026-11-23** ("procede con el gate M2"), con D1–D5 tal como están en §0. Las instalaciones 🟡 siguen pendientes del humano.

Insumos: `2026-11-21_inventario.md`, `2026-11-21_diagnostico.md`, `2026-11-21_scorecard.md` (mismo directorio).

## 0. Decisiones que este plan da por tomadas (confirmar en el Gate)

| # | Decisión | Supuesto del plan | Origen |
|---|---|---|---|
| D1 | Alcance (Gate M1) | Opción 2 (por módulos) + opción 4 (formato SDD) en paralelo, que es la recomendación del scorecard | `2026-11-21_scorecard.md` §4 y §6 |
| D2 | Ruta `/experience` deshabilitada | Se **elimina** el código muerto (página, datos y traducciones) y queda recuperable desde el historial de git. Si se prefiere conservarla, F7.1 pasa a "completar contenido real y reactivar" como feature aparte | H3, `App.tsx:16-22` |
| D3 | Gestor de paquetes | Migrar de `npm` a `pnpm` para cumplir SC-01/SC-02 (`minimumReleaseAge`, `onlyBuiltDependencies`). Alternativa más chica: quedarse en npm con `.npmrc` `ignore-scripts=true` y registrar SC-01 como desviación | Scorecard SC-01/02 |
| D4 | Estado de servidor | Adoptar TanStack Query para Blog y Projects (RC-02, nivel R) | Scorecard RC-02 |
| D5 | Estructura por feature | Sí (ST-01, nivel O), módulo por módulo según la matriz de riesgo | Scorecard ST-01, §3 |

## 1. Tarea previa, fuera del plan (MI-05)

| Tarea | Rama | Estado |
|---|---|---|
| T-000 · Hero del Home muestra el nombre completo: `home.title` = "Euclides Rafael Marin", el rol pasa al subtítulo ("Full Stack Developer especializado en React y Node.js" / "Full Stack Developer specialized in React & Node.js") | `fix/hero-title` (commit `2fb73fa`, local, sin push) | Hecho. `tsc -b` y `eslint .` limpios; 83/83 tests en verde con `NODE_OPTIONS=--no-experimental-webstorage` |

Es un cambio de contenido pedido por el humano, no una fase: va en su propia rama. El `<title>` del documento, las metas OG/Twitter y `profile.name` ya decían "Euclides Rafael Marin" (`frontend/index.html:18,27,33`, `frontend/src/data/profile.ts:2`, `frontend/src/locales/*.ts` `meta.home.title`).

## 2. Hallazgo nuevo de esta sesión: causa de H1

La suite no falla por jsdom ni por el código. Node 26 trae Web Storage nativo activado por defecto y ese `localStorage` global choca con el de jsdom. Evidencia: con Node `v26.13.1` y `NODE_OPTIONS=--no-experimental-webstorage`, `npx vitest run` → `Test Files 12 passed (12)`, `Tests 83 passed (83)`. La solución de fondo es fijar Node 22 (F4.1); el flag queda como alternativa documentada.

## 3. Fases

Orden por defecto del skill. Cada fase en su rama, integrable y reversible por separado (MI-04). Ninguna cambia comportamiento (MI-03): la batería de caracterización de F2b y los 83 tests existentes deben quedar en verde antes y después de cada una. Los bugs que aparezcan se abren como tareas aparte (MI-05).

Leyenda de comandos: 🟢 los ejecuta el agente · 🟡 los ejecuta el humano (instalar paquetes, cambiar configuración) · 🔴 solo el humano.

### F1 · Secretos y seguridad crítica

- **Rama:** `migr/f1-seguridad`
- **Llaves (MP-06):** `.github/workflows/ci.yml`, `frontend/src/components/PersonJsonLd.tsx`
- **Trabajo:**
  1. 🟡 Instalar `gitleaks` y correr `gitleaks detect --redact` y `gitleaks detect --log-opts="--all" --redact` (cierra TX-01 formalmente).
  2. 🟢 `npm audit --omit=dev` y `npm audit` → informe; altos o críticos se abren como tareas aparte (TX-06).
  3. 🟢 `ci.yml`: fijar `actions/checkout` y `actions/setup-node` por SHA de commit con el tag en el nombre del paso; añadir `permissions: contents: read` (SC-04).
  4. 🟢 `PersonJsonLd.tsx`: escapar `<` en el JSON serializado (`<`) antes de inyectarlo, o justificar la excepción RC-04 en `decisions.md` (H6).
- **Verificación:** CI en verde en la rama; gitleaks sin hallazgos; diff de `index.html` generado idéntico salvo el escape.
- **Reversa:** `git revert` del merge; ningún cambio de runtime.
- **Riesgo:** bajo.

### F2 · Formato SDD

- **Rama:** `migr/f2-formato-sdd`
- **Llaves:** `.gitignore`, `docs/**` (excepto `docs/reports/migrations/`), `readme.md`, `package.json` raíz
- **Trabajo:**
  1. 🟢 Crear `docs/comments/` y añadir `docs/comments/` a `.gitignore` (CC-06/CC-07, H5).
  2. 🟢 Decidir el tratamiento de `.claude/` y `.impeccable/`: añadirlos a `.gitignore` (son config y estado local de herramientas, H8).
  3. 🟢 Reconciliar `docs/project-documentation.md` con el código: quitar la navegación y la ruta `/experience` o marcarlas como retiradas (H2). Regenerar `.html`/`.pdf` o retirarlos si ya no se usan.
  4. 🟢 `package.json` raíz: añadir scripts que deleguen en `frontend/` (`"test": "npm --prefix frontend test"`, etc.) o documentar que la raíz no es ejecutable (H7).
  5. 🟢 Registrar `specs/static-coolify-deploy/` como spec v5 vigente (ya es compatible, estado `done`).
- **Verificación:** `git check-ignore docs/comments/x` devuelve la ruta; docs sin menciones a rutas inexistentes (`grep -n experience docs/project-documentation.md`).
- **Reversa:** `git revert`; solo documentación y configuración de git.
- **Riesgo:** muy bajo. Se puede correr en paralelo con F1 (llaves disjuntas).

### F2b · Línea base de caracterización (requisito de F3 en adelante)

- **Rama:** `migr/f2b-caracterizacion`
- **Llaves:** `frontend/e2e/**`, `frontend/playwright.config.ts`, `.github/workflows/ci.yml` (paso nuevo, después de F1)
- **Trabajo:**
  1. 🟡 Instalar Playwright y `@axe-core/playwright` (paquetes nuevos; antes, `npm view` de cada uno).
  2. 🟢 Golden master por ruta (`/`, `/projects`, `/blog`, `/contact`, 404) en ES y EN: captura visual + snapshot del DOM accesible + `axe` sin violaciones serias (skill `characterization-testing`).
  3. 🟢 Servicios externos simulados (WordPress REST y EmailJS) con respuestas fijas para que la batería sea determinista.
  4. 🟢 Medir cobertura actual con `npm run test:coverage` y guardarla como línea base (PT-02).
- **Verificación:** 3 corridas seguidas sin fallos intermitentes (PT-04); prueba de fuerza por mutación sobre al menos un caso por ruta.
- **Reversa:** borrar la carpeta `e2e/` y el paso de CI; no toca código de producto.
- **Riesgo:** bajo.

### F3 · Comentarios fuera del código (Política CC)

- **Rama:** `migr/f3-comentarios`
- **Llaves:** `frontend/src/**` (solo comentarios), `docs/comments/**`
- **Trabajo:**
  1. 🟢 `comments-extraction`: mover los 127 comentarios a `docs/comments/` con ID y anclaje, sin perder ninguno (122 CC-01, 3 TODO CC-03, 2 directivas CC-E2).
  2. 🟢 Los 3 `TODO(rafael)` se convierten en tareas del backlog; los de "Experiencia" desaparecen con F7.1 si se aprueba D2.
  3. 🟢 Las 2 directivas de lint quedan con su ID de nota (excepción E2).
  4. 🟢 Cabecera de autoría E1 donde la política lo exija (TX-15).
- **Verificación:** `extract_comments.py` reporta 0 comentarios fuera de E1–E4; conteo de notas en `docs/comments/` = 127; caracterización F2b en verde; `git diff --stat` solo con líneas de comentario.
- **Reversa:** `git revert`.
- **Riesgo:** bajo; toca muchos archivos, por eso no corre en paralelo con F6.

### F4 · Herramientas (primero en modo informe, luego bloqueante)

- **Rama:** `migr/f4-herramientas`
- **Llaves:** `frontend/package.json` (scripts y `engines`), `.nvmrc`, `frontend/eslint.config.js`, `frontend/tsconfig*.json`, `.prettierrc*`, `.github/workflows/ci.yml`
- **Trabajo:**
  1. 🟢 `.nvmrc` con `22` y `"engines": { "node": ">=22 <23" }` en `frontend/package.json` (H1, PT-04). Documentar en el readme el flag `--no-experimental-webstorage` para quien use Node 26.
  2. 🟡 Prettier + `prettier-plugin-tailwindcss` (TX-11, TS-07, CS-02). Primer commit: solo configuración; segundo commit: formateo masivo separado para que el diff sea revisable.
  3. 🟢 ESLint `strict-type-checked` en modo `warn`; pasa a `error` cuando el conteo llegue a 0 (TS-07).
  4. 🟢 `tsconfig.app.json`: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride` (TS-01). Los errores que salgan se corrigen sin cambiar comportamiento o se abren como tareas.
  5. 🟡 `eslint-plugin-react-hooks` v7 con preset del compilador en modo `warn` (RC-11), y `eslint-plugin-boundaries` en modo informe (ST-02).
  6. 🟢 CI: añadir `format:check` y la batería E2E de F2b.
- **Verificación:** CI en verde; 83 tests + caracterización en verde en Node 22.
- **Reversa:** `git revert`; reglas nuevas nacen en `warn`, así que revertir no rompe nada.
- **Riesgo:** bajo-medio (el formateo masivo choca con todo; ejecutar sin otras ramas abiertas sobre `src/`).

### F5 · Dependencias y versiones

- **Rama:** `migr/f5-dependencias`
- **Llaves:** `frontend/package.json`, lockfile, `.npmrc` / `pnpm-workspace.yaml`, `Dockerfile`, `ci.yml`
- **Trabajo:**
  1. 🟡 Según D3: migrar a `pnpm` con `minimumReleaseAge` y `onlyBuiltDependencies` (SC-01/SC-02), actualizando `Dockerfile` y CI a `pnpm install --frozen-lockfile`. Si D3 = quedarse en npm: `.npmrc` con `ignore-scripts=true` y desviación registrada para SC-01.
  2. 🟡 React Compiler (`babel-plugin-react-compiler`) detrás de configuración de Vite, verificando con F2b que no cambia el render (RC-11).
  3. 🟡 TypeScript 6 → 7 (TS-08, nivel R) con `upgrade-codemods`, un paso por versión.
- **Verificación:** imagen Docker construye igual (`docker build`); `npm view`/`pnpm view` de cada paquete nuevo; caracterización en verde; tamaño de bundle sin regresión >5 %.
- **Reversa:** `git revert` restaura `package-lock.json`; la imagen anterior sigue etiquetada en Coolify.
- **Riesgo:** medio (toca build y despliegue).

### F6 · Estructura por feature y arquitectura de efectos

- **Ramas:** una por módulo, en el orden de la matriz de riesgo (hojas primero): `migr/f6a-data-locales`, `migr/f6b-services`, `migr/f6c-pages`, `migr/f6d-theme-i18n`, `migr/f6e-sidebar`, `migr/f6f-app-routing`
- **Llaves:** cada rama declara solo las carpetas que mueve; nunca dos ramas F6 abiertas sobre el mismo módulo
- **Trabajo (patrón strangler, MP-01):**
  1. 🟢 Crear `src/features/<feature>/` y `src/shared/` (con ≥2 consumidores, ST-08). Mover un módulo por rama, dejando reexportaciones temporales en la ruta vieja hasta que no tenga importadores; luego se borran.
  2. 🟢 `src/shared/hooks/` con los hooks aprobados que reemplazan `useEffect` directo (RC-09): `ThemeContext.tsx:21`, `Sidebar.tsx:33,42,49`, `Contact.tsx:44`.
  3. 🟢 Según D4: `Blog.tsx:91` y `Projects.tsx:21` pasan a TanStack Query sobre los `services/` existentes (RC-02).
  4. 🟢 `Sidebar.tsx` (174 líneas) se parte en subcomponentes ≤150 (RC-14).
  5. 🟢 Estados `loading`/`error` como unión discriminada (TS-05).
- **Verificación:** por rama: caracterización F2b idéntica, 83 tests en verde, `madge --circular` sin ciclos (ST-03), lint de fronteras sin violaciones nuevas.
- **Reversa:** cada rama se revierte sola; las reexportaciones permiten revertir un módulo sin tocar los demás.
- **Riesgo:** medio; `f6d` y `f6e` son medio-alto (estado global y navegación).

### F7 · Calidad

- **Rama:** `migr/f7-calidad`
- **Llaves:** `frontend/src/pages/Experience*`, `frontend/src/data/experience.ts`, `frontend/src/locales/*.ts` (claves `experience.*`), `frontend/src/App.tsx`
- **Trabajo:**
  1. 🟢 Según D2: eliminar página, datos, test y traducciones de "Experiencia" y el comentario de reactivación de `App.tsx:17-19` (AI-01, AI-03, AI-04, H3). Puede adelantarse y correr junto con F1/F2: sus llaves no chocan con ellas.
  2. 🟡 `knip` y `jscpd` para confirmar exports muertos y duplicación (AI-01, AI-02); lo que encuentren se cataloga y se limpia en esta misma fase solo si no cambia comportamiento.
- **Verificación:** bundle sin las cadenas de "Experiencia" (`grep` sobre `dist/`); caracterización en verde (la ruta ya no existía, así que no cambia nada visible).
- **Reversa:** `git revert` recupera la sección completa.
- **Riesgo:** bajo.

### F8 · Base de datos

No aplica: SPA estática sin BD (`2026-11-21_scorecard.md`, DB-01..04 N/A). Sin Gate 2B.

### F9 · Trazabilidad

- **Rama:** `migr/f9-trazabilidad`
- **Llaves:** `specs/**`, `docs/reports/**`, `readme.md`
- **Trabajo:**
  1. 🟢 Specs retroactivos por capacidad (`spec-reverse-engineering`): portada/perfil, proyectos, blog (WordPress REST), contacto (EmailJS), i18n y tema. Sin contrato OpenAPI propio (no hay API); las dos integraciones externas se documentan como dependencias.
  2. 🟢 Medir Core Web Vitals y fijar presupuesto de bundle (PT-06) con Lighthouse/size-limit.
  3. 🟢 Informe de cierre con las desviaciones (MI-09) y el scorecard repetido.
- **Riesgo:** muy bajo.

## 4. Orden y paralelismo

```
F1 ─┬─► F2b ─► F3 ─► F4 ─► F5 ─► F6a..f (secuencial por módulo) ─► F9
F2 ─┘                         
F7.1 (código muerto) puede ir en paralelo a F1/F2
```

F3 y F4.2 (formateo masivo) tocan casi todo `src/`; no se abren otras ramas sobre `src/` mientras estén activas.

## 5. Producción (MP-02, MP-03, MP-04)

El sitio es estático y se sirve desde un único contenedor en Coolify; no hay tráfico de API que comparar en sombra ni balanceo para canario.

- **Desviación MP-02 (MI-09):** en lugar de sombra y canario, cada release pasa por la batería de caracterización contra un despliegue de staging (o preview de Coolify) antes de promover. Riesgo: bajo, el contenido es público y sin estado. Promover sigue siendo decisión del humano.
- **MP-03 (reversa en un cambio):** redeploy de la imagen anterior por etiqueta en Coolify. Ensayarlo una vez antes del primer despliegue de F5 (la fase que cambia el build). 🔴 Humano.
- **MP-04:** no hay sistema legado que retirar; las reexportaciones temporales de F6 se borran cuando `grep` de importadores da cero.
- Merge a `main`, push y despliegue: siempre del humano.

## 6. Desviaciones registradas (MI-09)

| Regla | Motivo | Riesgo | Plan |
|---|---|---|---|
| MP-02 sombra/canario | Sitio estático en un solo contenedor | Bajo | Staging + caracterización antes de promover |
| PT-03 mutation testing | Sin módulos críticos (auth, pagos) | Bajo | Solo prueba de fuerza en F2b |
| SC-01 (si D3 = npm) | npm no tiene `minimumReleaseAge` | Medio | `ignore-scripts=true` + revisión manual de cada paquete nuevo (SC-05) |

## 7. Pendiente para aprobar el Gate M2

1. Confirmar D1–D5.
2. Aprobar la instalación de herramientas 🟡: gitleaks, Playwright + axe, Prettier, plugins de ESLint, knip, jscpd y (según D3) pnpm.
3. Decidir si `fix/hero-title` se integra antes de F1 (recomendado: sí, es independiente).

## 8. Avance

| Fase / tarea | Rama | Commit | Estado | Evidencia |
|---|---|---|---|---|
| T-000 Título del Home | `fix/hero-title` | `2fb73fa` | Lista para integrar | `tsc -b` 0, `eslint .` 0, 83/83 tests |
| F1 Seguridad | `migr/f1-seguridad` | `a38789e` | Lista para integrar. Punto 1 cerrado: gitleaks 8.30.1 (winget `Gitleaks.Gitleaks`) sin hallazgos en el árbol, en `main` y en las 55 confirmaciones de todas las ramas | `tsc -b` 0, `eslint .` 0, 83/83 tests; Actions fijadas a v4.4.0 (checkout `11d5960a…`, setup-node `49933ea5…`, obtenidos con `git ls-remote --tags`) |
| F2 Formato SDD | `migr/f2-formato-sdd` | `e954e36` | Lista para integrar | `git check-ignore` confirma `docs/comments/`, `.claude/`, `.impeccable/`; `npm run lint` y `npm run typecheck` desde la raíz con exit 0 |
| F7.1 Código muerto "Experiencia" | `migr/f7-codigo-muerto` | `01cfba3` | Lista para integrar | 267 líneas borradas, 0 añadidas; `tsc -b` 0, `eslint .` 0, 74/74 tests (se fueron los 9 de `Experience.test.tsx`); `vite build` 0; `grep` de "Tech Corp", "Startup Inc", "viewExp" y "Ver Experiencia" en `dist/` = 0 archivos |
| F2b Línea base de caracterización | `migr/f2b-caracterizacion` (sobre `fix/hero-title`) | `405d281`, `7a62ab3` | Lista para integrar. Cobertura base pendiente (T-003) | 56 tests Playwright (2 proyectos: desktop y móvil): 40 golden masters (hechos de la página, árbol accesible, axe WCAG 2.1 A/AA, capturas `@visual` solo locales) y 16 de interacción. 3 corridas seguidas iguales: 55 pasan y 1 se salta (el drawer móvil no existe en desktop). Prueba de fuerza: 7 de 7 mutaciones detectadas (una por ruta, más contacto y tema). axe: 0 violaciones en todas las páginas |
| F3 → F9 | — | — | F3 puede empezar. F4–F9 necesitan instalaciones 🟡 (Prettier, plugins de ESLint, knip, jscpd, pnpm) | — |

`git merge-tree` confirma que las cinco ramas se integran sobre `main` sin conflictos. Sobre el árbol integrado (worktree temporal fuera del repo): `npm ci`, 74/74 tests unitarios y 3 corridas de Playwright con 55 que pasan y 1 que se salta (MI-03).

Notas:
- El `node_modules` local estaba desalineado con el lockfile (versiones más nuevas instaladas sin guardar). Desde F2b todas las verificaciones corren sobre `npm ci`, y F1 y F7 se volvieron a verificar así: F1 83/83, F7 74/74, `tsc -b` y `eslint .` con exit 0.
- Los tests se corrieron con Node v26.13.1 y `NODE_OPTIONS=--no-experimental-webstorage` (ver §2). CI los corre en Node 22.
- En `docs/reports/migrations/2026-11-21_inventario.json` y `2026-11-21_diagnostico.md` se cambiaron las rutas absolutas locales por rutas relativas al repo antes de versionarlos (el repo es público). Solo cambió el prefijo de ruta.
- `docs/project-documentation.html` y `.pdf` siguen siendo copias de la v1.0 sin marcar. No se referencian en el repo; borrarlas o regenerarlas lo decide el humano.

### Integración en `main` (2026-11-23, a pedido del humano)

Merge commits `--no-ff`, uno por rama, en este orden: `fix/hero-title` (`8c40e4d`), `migr/f1-seguridad` (`2108753`), `migr/f2-formato-sdd` (`ead0f6c`), `migr/f7-codigo-muerto` (`7fec720`), `migr/f2b-caracterizacion` (`d355b95`), `task/t-003-coverage` (`8632029`). Sin conflictos. Cada fase se revierte sola con `git revert -m 1 <merge>`. Verificación sobre `main` con `npm ci`: `tsc -b` 0, `eslint .` 0, 74/74 unitarios, `vite build` 0 y Playwright con 55 que pasan y 1 que se salta. Sin push: subir y desplegar sigue siendo del humano.

## 9. Tareas abiertas fuera de fases (MI-05)

| ID | Tarea | Severidad | Evidencia | Quién |
|---|---|---|---|---|
| T-001 | Actualizar `react-router` y `zod` (vulnerabilidades altas que llegan a producción) y el resto de `npm audit` (23 en total: 9 altas, 12 moderadas, 2 bajas; todas con arreglo sin cambio de versión mayor) | Alta | `npm audit --omit=dev` → `react-router 6.0.0 - 7.18.1` high, `zod <4.6.6` high (GHSA-mrhx-c7xc-m3w5); `npm audit` → 23 vulnerabilidades  Sigue abierta el 2026-11-23 después de integrar: en `main`, `npm audit --omit=dev` todavía reporta 2 altas (`react-router`, `zod`). El informe pre-producción de otra sesión (`docs/reports/security/2026-11-23_preprod-review.md`) la marca como bloqueante. | Humano 🟡 (`npm audit fix` en `frontend/`), luego el agente verifica |
| T-002 | `index.html` deja su `<meta name="description">` y su `<title>` estáticos, y React 19 añade los suyos por página. La `description` que queda primera es siempre la española del Home, en cualquier página e idioma. Lo mismo pasa con `og:title` | Media (SEO) | Golden master `*-facts.json` (campo `description`); sondeo en `/blog` en inglés: dos `meta[name=description]` y dos `<title>` | Agente, en tarea aparte; cambia la salida del head, así que hay que regenerar los golden masters con aprobación |
| T-003 | Faltaba `@vitest/coverage-v8` | Baja | **Cerrada**: rama `task/t-003-coverage`, versión exacta 4.1.5, resuelta con `--before=2026-11-16` (todo paquete nuevo o actualizado tiene 7 días o más). Cobertura base en 3 corridas: líneas 88,65–93,29 %, sentencias 85,97–90,04 %, ramas 72,66–74,82 %, funciones 86,41–88,88 %. El rango se debe a T-005 | — |
| T-005 | La cobertura de `src/services/wordpress.ts` varía entre corridas (líneas 74,5 % a 90,19 %): `getProjectPosts` a veces queda cubierta y a veces no. Algún test termina antes de que se resuelva la llamada asíncrona a WordPress. Pasa siempre, pero lo que cubre depende de la sincronización (PT-04) | Media | 3 corridas de `npm run test:coverage` con resultados distintos y sin cambios de código | Agente, en tarea aparte (hacer que los tests de Projects y Blog esperen la llamada) |
| T-004 | La batería de caracterización todavía no corrió en CI (Linux). Los snapshots de texto no dependen de la plataforma, pero falta confirmarlo con la primera corrida | Baja | `ci.yml`, paso "Run characterization suite" | Se cierra con el primer push |
