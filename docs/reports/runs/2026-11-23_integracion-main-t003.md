# Informe de sesión · 2026-11-23 · Integración en main y T-003

## Pedido del humano

"Procede con la instalación de vitest, ya yo corrí npm audit, procede con la integración en el main".

## Qué se hizo

1. **Integración en `main`**, en el orden acordado y con un merge commit `--no-ff` por rama: `fix/hero-title`, `migr/f1-seguridad`, `migr/f2-formato-sdd`, `migr/f7-codigo-muerto`, `migr/f2b-caracterizacion`. Sin conflictos. El árbol de código resultante es idéntico al que ya se había verificado en el worktree temporal; solo difieren dos documentos de informe.
2. **T-003**: `@vitest/coverage-v8@4.1.5` en la rama `task/t-003-coverage`, fusionada en `main` (`8632029`).
   - Primer intento: arrastraba `@babel/*` 7.29.15, publicado hace 3 días. Se revirtió y se instaló con `--before=2026-11-16` → `@babel/*` 7.29.14 (11-nov).
   - Paquetes nuevos o actualizados: 13 nuevos y 4 `@babel/*` con subidas de parche. `magicast` exige `@babel/parser` y `@babel/types` `^7.29.7`. Todos tienen 7 días o más (`npm view <paquete> time`).
   - Se añadió `coverage` a `frontend/.gitignore`.

## Evidencia sobre `main` (después de `npm ci`)

| Comando | Resultado |
|---|---|
| `npx tsc -b` | exit 0 |
| `npx eslint .` | exit 0 |
| `npx vitest run` (con `NODE_OPTIONS=--no-experimental-webstorage`) | 74/74 |
| `npx vite build` | exit 0 |
| `npx playwright test` | 55 pasan y 1 se salta |
| `npm run test:coverage` ×3 | líneas 88,65–93,29 %; varía por T-005 |
| `npm audit --omit=dev` | **2 altas** (`react-router`, `zod`) |

## Incidencias

- **T-001 sigue abierta.** El humano corrió `npm audit`, pero el arreglo (`npm audit fix`) no está aplicado en el repo: el lockfile de `main` no cambió y las dos vulnerabilidades altas de producción siguen ahí. El informe pre-producción de otra sesión las marca como bloqueantes.
- **Cobertura variable (T-005).** Tres corridas sin cambios de código dieron resultados distintos en `wordpress.ts`.
- Los archivos `docs/reports/runs/2026-11-23_security-preprod-review.md` y `docs/reports/security/` vienen de otra sesión. Siguen sin trackear y no se tocaron.

## Pendiente del humano

1. T-001: decidir si se aplica `npm audit fix` (se puede hacer en su propia rama, con la batería de caracterización como red de seguridad).
2. Push de `main` y despliegue.
3. Limpiar `frontend/test-results/` (ya ignorado) y el worktree temporal del scratchpad (`git worktree remove`).
4. Evaluación del shadow de las fases integradas.
