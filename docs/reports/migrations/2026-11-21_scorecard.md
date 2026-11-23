# Scorecard de gap-analysis (Gate M1) · technical-portfolio · 2026-11-21

Ejecutor: `gap-analyzer` (dominio Migración, SDD v5). Skill: `gap-analysis` (GA-01..05), con `common-security`, `common-quality`, `supply-chain`, `policy-no-comments`, `testing` y los skills de stack aplicables (`stack-react`, `stack-typescript`, `stack-javascript`, `stack-css-tailwind`; `stack-infra-coolify-hetzner` solo informativo). Alcance: **solo lectura (MI-01 / GA-05)** — este informe no corrige nada.

Entrada: `2026-11-21_inventario.json`, `2026-11-21_inventario.md`, `2026-11-21_diagnostico.md` (mismo directorio). No se re-escaneó desde cero; cada afirmación se contrastó contra esos insumos y, cuando hizo falta, contra el código fuente (citado por archivo:línea).

Convención: **Cumple** / **Parcial** / **No cumple** / **N/A** (no aplica al tipo de proyecto). Nivel **O** = obligatoria, **R** = recomendada.

---

## 1. Scorecard por área (GA-02)

| Área | Reglas | Cumplimiento | Críticos | Comentario |
|---|---|---|---|---|
| Seguridad | TX-01..08, DB-01..04, RC-04/05/15, JS-04/05/06 | **~88%** (7 cumple / 2 parcial / resto N/A) | 0 | Sin secretos en repo ni historial (TX-01). Validación Zod en el único borde externo (contacto + respuestas WP). Único parcial de riesgo bajo: `dangerouslySetInnerHTML` sin DOMPurify (RC-04, H6). `npm audit` no ejecutado (TX-06 parcial). |
| Estructura | ST-01..08 | **~55%** (3 cumple / 3 parcial / 1 no / 1 N/A) | 0 | Organización por **tipo** (`components/`, `pages/`, `services/`, `data/`), no por feature (ST-01 no cumple). Tamaños dentro de límite (ST-04 cumple, todos los archivos < 300 líneas). Sin fronteras de módulo verificadas (ST-02 parcial). |
| Código basura de IA | AI-01..09 | **~60%** (4 cumple / 3 parcial / 1 no) | 0 | Código muerto real: sección "Experiencia" deshabilitada sigue en el bundle, con contenido placeholder (AI-01 no cumple, AI-03/AI-04 parcial — H3). Sin APIs inventadas (AI-05), sin código defensivo de relleno (AI-06). |
| Stack y versiones | RC-*, TS-*, JS-*, CS-* | **~62%** (14 cumple / 7 parcial / 3 no) | 0 | Divergencia arquitectónica frente a la línea base v5: sin React Compiler ni `eslint-plugin-react-hooks` v7 (RC-11 no cumple), `useEffect` directo en 5 componentes sin hooks aprobados (RC-09 no cumple), `fetch` en `useEffect` en vez de TanStack Query (RC-02 no cumple). `tsconfig` estricto pero incompleto (TS-01 parcial); ESLint `recommended`, no `strict-type-checked`, sin Prettier en repo (TS-07 parcial). |
| Comentarios (CC) | CC-01..08 | **No cumple** | 127 comentarios · 1 "sensible" (falso positivo CSS) | Deuda previa a SDD v5: 122 `CC-01`, 3 `CC-03` (TODO), 2 `CC-E2`. Falta cabecera de autoría E1/TX-15. (H4) |
| Tests | PT-01..10 | **~40% verificable** · E2E: no | n/d | 14 archivos de test (unit + componente con Testing Library). Sin E2E (PT-01 parcial). Cobertura del diff no medible en este diagnóstico (PT-02 n/d). Suite no reproducible localmente por falta de pin de Node (PT-04 — H1). |
| Cadena de suministro | SC-01..06 | **~25%** (1 cumple / 3 no / 2 N/A) | 0 | `npm` + `package-lock.json`, sin `.npmrc`: sin `minimumReleaseAge` (SC-01 no cumple) ni `ignore-scripts`/`onlyBuiltDependencies` (SC-02 no cumple). GitHub Actions fijadas por **tag** `@v4`, no por SHA, y sin bloque `permissions` (SC-04 no cumple). `npm ci` en CI sí cumple el "install congelado" (SC-03 cumple). |
| Trazabilidad SDD | specs, contratos, docs/reports, docs/comments | **Parcial** | — | `specs/static-coolify-deploy/` completo y en estado `done` (esquema compatible v4/v5). `docs/reports/` creado por este diagnóstico. **Faltan** `docs/comments/` y su entrada en `.gitignore` (H5). Docs de producto divergen del código (H2). |

Nota sobre porcentajes: se calculan sobre las reglas **aplicables** (se excluyen las N/A por ser SPA estática sin backend ni BD). Son orientativos para el Gate M1, no una nota de rúbrica (eso corresponde a `rubric-migration` + interrogatorio del shadow).

---

## 2. Anexo: tabla regla por regla (GA-01)

### common-security

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| TX-01 Secretos fuera del repo | O | Cumple | `2026-11-21_diagnostico.md` §4 (grep de patrones + historial + `.env` en `.gitignore` raíz y `frontend/`); `secret_candidates.count = 0`. Pendiente confirmar con gitleaks (no disponible en el entorno). |
| TX-02 Validar toda entrada externa | O | Cumple | `Contact.tsx:13-19` (Zod); `services/wordpress.ts:35-120` valida respuestas remotas con Zod. |
| TX-03 Autorización por endpoint | O | N/A | Sin backend ni endpoints propios (`tech-spec.md:9-11`). |
| TX-04 Consultas parametrizadas | O | N/A | Sin BD (`inv["php"]=[]`, `inv["python"]=[]`, `wordpress=false`). |
| TX-05 Un paquete por sugerencia, existe y mantenido | O | Cumple | Sin paquetes inventados; frameworks declarados en `frontend/package.json`. Reputación formal → fase posterior (SC-05). |
| TX-06 Lockfile versionado + audit sin críticos/altos | O | Parcial | `frontend/package-lock.json` versionado; `npm audit` **no ejecutado** en este diagnóstico. |
| TX-07 Errores sin stack trace al cliente | O | Cumple | `ErrorBoundary.tsx` por ruta (`App.tsx:13-26`); sitio estático sin respuestas de servidor propias. |
| TX-08 Logs sin datos sensibles | R | N/A | Sin logging de servidor. |
| DB-01..04 Migraciones/esquema/destructivas | O/R | N/A | Sin BD. |

### stack-react (seguridad del cliente)

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| RC-04 `dangerouslySetInnerHTML` solo sanitizado | O | Parcial | `PersonJsonLd.tsx:22` inyecta `JSON.stringify(schema)` sin DOMPurify; dato 100% interno de `data/profile.ts`, riesgo bajo hoy (H6). No es HTML de usuario pero no cumple la letra de la regla. |
| RC-05 Solo `VITE_` público, sin secretos en bundle | O | Cumple | `.env.example:11-15`; claves EmailJS públicas por diseño; CSP acota `connect-src` (`nginx.conf:37`). |
| RC-15 URLs de usuario validadas | O | Cumple | Enlaces salientes provienen de datos internos (`data/projects.ts`), no de entrada de usuario. |

### stack-javascript (seguridad)

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| JS-04 Sin `eval`/`new Function` | O | Cumple | Sin coincidencias en `src/` (grep). |
| JS-05 Prototype pollution | O | N/A/Cumple | Sin fusión de objetos del usuario; entrada externa pasa por Zod. |
| JS-06 RegEx sin ReDoS | O | Cumple | Validación de email vía Zod, no regex propia sobre entrada libre. |

### common-quality (estructura y proceso)

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| TX-10 AI-TDD, test por escenario | O | Parcial | 14 archivos de test cubren comportamiento (p.ej. `Projects.test.tsx`, `Contact.test.tsx`), pero no hay evidencia de test-primero ni contrato BDD. |
| TX-11 Formateador + linter en repo | O | Parcial | `eslint.config.js` presente y pasa; **sin configuración de Prettier** en el repo. |
| TX-12 Tipado estricto | O | Cumple | `tsconfig.app.json:19` `strict:true`; `tsc -b` pasa limpio (diagnóstico §Evidencia). |
| TX-13 Esqueleto modular por feature | O | Parcial | Estructura por tipo, no por feature (ver ST-01). |
| TX-14 Contrato API OpenAPI (2C) | O | N/A | Sin API propia. |
| TX-15 Cabecera de autoría E1 | O | No cumple | No hay cabecera de autoría/marca en los archivos fuente. |
| TX-16 Didáctica en docs/comments | O | N/A | Aplica a entregas de tarea v5, no al estado heredado. |
| TX-17 Funciones cortas, sin código muerto/duplicado | R | Parcial | Funciones cortas, pero código muerto de "Experiencia" presente (H3). |
| TX-18 Conventional Commits | R | Parcial | Historial reciente descriptivo pero no estrictamente convencional (`git log`). |
| TX-19 Política CC | O | No cumple | 127 hallazgos (`inventario`; H4). |
| ST-01 Organización por feature | O | No cumple | `frontend/src/` dividido por tipo técnico (`components/`, `pages/`, `services/`, `data/`, `locales/`, `context/`). |
| ST-02 Dirección de dependencias | O | Parcial | Capa `services/` existe, pero sin dependency-cruiser ni `eslint-plugin-boundaries` que la imponga. |
| ST-03 Sin dependencias circulares | O | Cumple | No se detectaron (proyecto pequeño, imports unidireccionales); confirmar con madge en fase posterior. |
| ST-04 Límites de tamaño | O | Cumple | Archivo más grande no-test: `Sidebar.tsx` 174 líneas; todos < 300. |
| ST-05 Lógica pura al centro | R | Parcial | `services/` aísla efectos, pero lógica y fetch conviven en componentes (`Blog.tsx:91`). |
| ST-06 Abstracciones con ≥2 usos | O | Cumple | Sin interfaces/factories especulativas. |
| ST-07 Errores centralizados y tipados | O | Parcial | `ErrorBoundary` para UI; servicios manejan error localmente sin tipo de dominio común. |
| ST-08 `shared/` con ≥2 consumidores | R | N/A | No existe carpeta `shared/`. |

### common-quality (código basura de IA)

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| AI-01 Sin código muerto | O | No cumple | `data/experience.ts`, `pages/Experience.tsx` y traducciones siguen en el bundle pese a ruta deshabilitada (`App.tsx:16-22`; H3). `knip` no disponible para confirmar exports muertos. |
| AI-02 Sin duplicación sobre umbral | O | Cumple | Sin duplicación evidente; `jscpd` no ejecutado. |
| AI-03 YAGNI | O | Parcial | Sección "Experiencia" conservada "por si acaso" con comentario de reactivación (`App.tsx:17-19`). |
| AI-04 Sin implementaciones de relleno | O | Parcial | Contenido placeholder marcado `TODO(rafael)` en `experience.ts:6`, `locales/en.ts:40`, `es.ts:35` (H3). |
| AI-05 Sin APIs/paquetes inventados | O | Cumple | `tsc` + lint pasan; todo lo usado existe en las versiones instaladas. |
| AI-06 Sin código defensivo de relleno | O | Cumple | No se detectó try/catch que trague errores ni `?.` para tapar bugs. |
| AI-07 Sin deps para trivialidades | O | Cumple | Dependencias justificadas (RHF, Zod, i18next, framer-motion). |
| AI-08 Diff mínimo | O | N/A | Fase de diagnóstico, sin diff de código. |
| AI-09 Tests que prueban de verdad | O | Parcial | Tests por comportamiento; no verificable con mutation testing en esta fase. |

### stack-react (resto)

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| RC-01 Vite + TS, componentes funcionales | O | Cumple | `vite.config.ts`; funcionales salvo `ErrorBoundary` (clase, patrón estándar e inevitable en React). |
| RC-02 Estado de servidor con TanStack Query | R | No cumple | `fetch` directo en `useEffect` (`Blog.tsx:91`, `Projects.tsx:21`), sin TanStack Query. |
| RC-03 Formularios RHF + Zod | R | Cumple | `Contact.tsx:13-19`. |
| RC-06 Accesibilidad | O | Parcial | Auditoría de diseño previa resuelta (H9), pero sin axe automatizado en CI. |
| RC-07 Error boundaries + lazy | R | Cumple | `App.tsx:4-9,13-26` (`ErrorBoundary` + `lazy`). |
| RC-08 Vitest + Testing Library | O | Cumple | 14 archivos `.test.tsx`/`.test.ts`. |
| RC-09 `useEffect` directo prohibido / hooks aprobados | O | No cumple | `useEffect` directo en `ThemeContext.tsx:21`, `Sidebar.tsx:33,42,49`, `Blog.tsx:91`, `Projects.tsx:21`, `Contact.tsx:44`; no existe `src/shared/hooks/` ni regla de lint que lo prohíba. |
| RC-10 Alternativas a efectos | O | Parcial | Algunos efectos sincronizan con sistemas externos (localStorage, DOM), legítimos; otros podrían derivarse en render. |
| RC-11 React Compiler + hooks v7 recommended | O | No cumple | Sin React Compiler; `eslint.config.js` usa `reactHooks.configs.flat.recommended` (no v7 con preset del compilador). |
| RC-12 `useEffectEvent` | R | N/A | No se usa patrón de efecto que lo requiera. |
| RC-14 Composición, componentes ≤150 líneas | R | Parcial | `Sidebar.tsx` 174 líneas > 150. |
| RC-13 Server Components/Actions parcheados | O | N/A | SPA cliente pura, sin RSC/Server Actions. |

### stack-typescript

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| TS-01 tsconfig estricto completo | O | Parcial | `strict:true` y `verbatimModuleSyntax` presentes (`tsconfig.app.json:13,19`); **faltan** `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`. |
| TS-02 Prohibido `any` | O | Cumple | Sin `any` explícito en `src/` (grep); `recommended` lo marca. |
| TS-03 Sin aserciones para callar al compilador | O | Cumple | Sin `!`/`as` fuera de bordes evidentes (revisión). |
| TS-04 Zod como fuente única | O | Cumple | `services/wordpress.ts` infiere tipos desde esquemas Zod. |
| TS-05 Uniones discriminadas | R | Parcial | Estados con banderas (`loading`/`error`) en `Blog.tsx`; no unión discriminada. |
| TS-06 Uniones literales en vez de `enum` | R | Cumple | No se usan `enum`. |
| TS-07 ESLint strict-type-checked + Prettier | O | Parcial | `eslint.config.js` usa `tseslint.configs.recommended` (no `strict-type-checked`); sin Prettier. |
| TS-08 TypeScript 7 | R | Parcial | `typescript ~6.0.2`; la regla permite migrar pasando primero por 6.0, así que está en ruta válida. |

### stack-javascript (resto)

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| JS-01 Módulos ESM, sin `var` | O | Cumple | Imports ESM en todo `src/`; `recommended` prohíbe `var`. |
| JS-02 Inmutabilidad por defecto | O | Cumple | `const` dominante; sin mutación de parámetros detectada. |
| JS-03 Promesas manejadas | O | Cumple | `await`/`try-catch` en `services/` y efectos de fetch. |
| JS-07 Igualdad estricta | O | Cumple | Sin `==` detectado; `eqeqeq` vía recommended. |
| JS-08 Fechas con Temporal/librería | R | N/A | Sin aritmética de fechas en el cliente. |

### stack-css-tailwind

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| CS-01 Tailwind 4 con tokens `@theme` | O | Cumple | `index.css` con tokens semánticos (`index.css:5`); Tailwind `^4.3.0`. |
| CS-02 Orden de clases automático | O | Parcial | Sin `prettier-plugin-tailwindcss` en el repo. |
| CS-03 Sin estilos en línea | O | Cumple | Estilos vía clases Tailwind; sin `style=` estáticos. |
| CS-04 Contraste AA + foco visible | O | Cumple | Auditoría previa resuelta (H9: foco en drawer, `Sidebar.tsx:42-56`); sin axe automatizado. |

### testing

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| PT-01 Pirámide de pruebas | O | Parcial | Unit + componente presentes; **sin E2E** (Playwright). |
| PT-02 Cobertura ≥80% del diff | O | n/d | Script `test:coverage` existe; no medible en diagnóstico de solo lectura. |
| PT-03 Mutation testing en módulos críticos | O | N/A | Sin módulos críticos (auth/pagos/permisos). |
| PT-04 Sin tests intermitentes (3 corridas) | O | No cumple (entorno) | 72/83 fallan localmente por incompatibilidad Node v26 vs 22 (H1); sin `.nvmrc`/`engines` que fije el runtime. Debe reconfirmarse en Node 22.x. |
| PT-05..08 Rendimiento/N+1/resiliencia | O | N/A | Sin API ni BD; aplica CWV (ver PT-06). |
| PT-06 Core Web Vitals + presupuesto bundle | O | n/d | No medido (Lighthouse/size-limit no ejecutados). |
| PT-10 Datos de prueba aislados | O | Cumple | Tests de componente con render aislado por caso. |

### supply-chain

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| SC-01 `minimumReleaseAge` (pnpm) | O | No cumple | Proyecto usa `npm`; sin `.npmrc` (confirmado: no existe en raíz ni `frontend/`). |
| SC-02 Scripts de instalación desactivados / `onlyBuiltDependencies` | O | No cumple | Sin `.npmrc` con `ignore-scripts`; sin `onlyBuiltDependencies`. |
| SC-03 Instalación congelada en CI | O | Cumple | `ci.yml:28` `npm ci`. |
| SC-04 Actions fijadas por SHA + `permissions` mínimos | O | No cumple | `ci.yml` usa `actions/checkout@v4` y `actions/setup-node@v4` (tags, no SHA); sin bloque `permissions`. |
| SC-05 Revisión de reputación de paquetes | O | N/A | Diagnóstico; se ejecuta al agregar dependencias. |
| SC-06 `ignore-scripts` global en la máquina | R | N/A | Config de máquina, fuera del repo. |

### policy-no-comments

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| CC-01 Cero comentarios | O | No cumple | 122 hallazgos (`inventario`; ejemplos `services/wordpress.ts:34,48,72,76-81`, `i18n.ts:17,27-29`, `App.tsx:17-19`). |
| CC-02 Sin código comentado | O | Parcial | Incluido en el conteo CC-01; sin verificación específica de bloques comentados. |
| CC-03 Sin TODO/FIXME/HACK | O | No cumple | 3 `TODO(rafael)` (`experience.ts:6`, `locales/en.ts:40`, `es.ts:35`). |
| CC-06 Notas con ID en docs/comments | O | No cumple | No existe `docs/comments/` (H5). |
| CC-07 `docs/comments/` en `.gitignore` | O | No cumple | `.gitignore` raíz sin entrada `docs/comments`. |
| CC-08 Notas sin credenciales | O | N/A | No hay carpeta de notas aún. |
| CC-E2 Directivas de lint con ID de nota | — | No cumple | 2 directivas sin nota asociada (`inventario`). |

### stack-infra-coolify-hetzner (informativo, solo lectura del repo)

| ID | Nivel | Estado | Evidencia |
|---|---|---|---|
| IN-06 Secretos solo en variables de Coolify | O | Cumple (lado repo) | `VITE_*` inyectadas en build; `.env` fuera de git. Config real del servidor fuera de alcance de este diagnóstico. |
| IN-10 Healthcheck por servicio | R | Parcial | `nginx.conf` sirve la SPA; healthcheck del contenedor a confirmar en Coolify (no en repo). |

El resto de reglas IN-* operan sobre el servidor (Amarillo/Rojo, humano) y no se evalúan desde el repositorio.

---

## 3. Matriz de riesgo por módulo (GA-03)

Orden de migración sugerido: **hojas primero, núcleo al final.** Criterios: complejidad, acoplamiento, cobertura visible y criticidad.

| Módulo | Complejidad | Acoplamiento | Cobertura | Criticidad negocio | Riesgo | Orden |
|---|---|---|---|---|---|---|
| `data/*`, `locales/*` | Baja | Bajo | Indirecta | Baja (contenido) | **Bajo** | 1 (hoja) — incluye limpiar código muerto H3 |
| `services/email.ts`, `services/wordpress.ts` | Media | Bajo (borde externo) | `*.test.ts` presente | Media (integraciones) | **Medio** | 2 — bien aisladas, buenas candidatas a TanStack Query (RC-02) |
| `pages/*` (Home/Projects/Blog/Contact) | Media | Medio (usan services + i18n) | `*.test.tsx` presente | Media | **Medio** | 3 — aquí vive el `fetch` en `useEffect` (RC-09/RC-02) |
| `context/ThemeContext.tsx`, `i18n.ts` | Media | Alto (globales) | Parcial | Media (toda la app) | **Medio-alto** | 4 — efectos de sincronización externa; refactor a hooks aprobados |
| `components/Sidebar.tsx` | Media-alta (174 líneas, 3 efectos) | Alto (navegación) | Indirecta | Media | **Medio-alto** | 5 — a11y ya resuelta (H9), pero supera RC-14 |
| `App.tsx` + routing + `ErrorBoundary` | Baja | Núcleo | `ErrorBoundary.test.tsx` | Alta (entrada) | **Núcleo** | 6 (último) — decidir destino de la ruta `/experience` |

---

## 4. Alcance propuesto (GA-04)

El humano decide en el Gate M1. Cinco opciones, de mayor a menor esfuerzo:

1. **Migración completa a SDD v5.** Alinear todo con la base de conocimiento: Política CC (quitar 127 comentarios → `docs/comments/`), arquitectura de efectos React (RC-09/RC-11: React Compiler, hooks aprobados, TanStack Query), endurecer supply-chain (migrar a pnpm con `minimumReleaseAge`, Actions por SHA, `permissions`), reorganizar por feature (ST-01), completar `tsconfig`/ESLint strict-type-checked + Prettier, añadir E2E y pin de Node. Esfuerzo alto; deja el portfolio como referencia canónica v5.

2. **Por módulos (recomendada).** Seguir la matriz de riesgo: empezar por hojas (`data`/`locales`, eliminando código muerto H3) y services, terminar por `App`/routing. Cada módulo entra con su contrato, tests y limpieza CC. Permite valor incremental sin congelar el proyecto.

3. **Solo seguridad y estructura.** Cerrar supply-chain (SC-01/02/04), confirmar secretos con gitleaks (TX-01/TX-06), eliminar código muerto (AI-01) y pinear Node (H1). Omite Política CC masiva y refactor de efectos. Esfuerzo medio; cierra los gaps O de seguridad/cadena.

4. **Solo formato SDD.** Crear `docs/comments/` + entrada en `.gitignore` (H5), reconciliar docs con el código (H2), registrar el spec existente en el flujo v5 y dejar `docs/reports/`. No toca código. Esfuerzo bajo; cierra trazabilidad, no calidad.

5. **Archivar.** No procede: el proyecto está vivo, desplegado y es el portfolio público. Se descarta.

---

## 5. Control de solo lectura (GA-05 / MI-01)

`git status` tras generar este scorecard: sin cambios en código fuente; único archivo nuevo = este scorecard en `docs/reports/migrations/` (más los artefactos previos del diagnóstico). Evidencia al pie del informe de sesión. No se ejecutó ningún comando Amarillo/Rojo; no se instaló nada; `gitleaks`, `knip`, `jscpd`, `npm audit` y Lighthouse quedan pendientes para la fase de plan por no estar disponibles en este entorno.

## 6. Gate M1

Queda a decisión humana el alcance. Recomendación del ejecutor: **opción 2 (por módulos)**, arrancando por la limpieza de código muerto (H3) y el pin de Node (H1) como primeras tareas de bajo riesgo y alto desbloqueo, en paralelo con la opción 4 (formato SDD) que no toca código.
