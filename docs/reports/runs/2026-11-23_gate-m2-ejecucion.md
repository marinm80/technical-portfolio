# Informe de sesión · 2026-11-23 · Gate M2 aprobado y primeras fases

## Decisión del humano

"procede con el gate M2": plan aprobado con D1–D5 tal como están en `docs/reports/migrations/plan.md` §0.

## Qué se hizo

Solo comandos 🟢 (lectura, build, tests, lint, commits locales). Sin instalaciones, sin push, sin tocar `main`.

| Rama | Commit | Contenido |
|---|---|---|
| `migr/f1-seguridad` | `a38789e` | Actions de CI fijadas por SHA, `permissions: contents: read`, escape de `<` en el JSON-LD |
| `migr/f2-formato-sdd` | `e954e36` + este commit | `docs/reports/` versionado, `docs/comments/`, `.claude/` y `.impeccable/` en `.gitignore`, doc v1.0 marcado como histórico, scripts en el `package.json` raíz |
| `migr/f7-codigo-muerto` | `01cfba3` | Sección "Experiencia" eliminada (página, datos, tipo, traducciones, comentarios de reactivación) |

## Evidencia

Detalle por fase en `plan.md` §8. Resumen: `tsc -b` y `eslint .` con exit 0 en las tres ramas; tests 83/83 (F1) y 74/74 (F7); `vite build` con exit 0 y sin texto de relleno en `dist/`; `git merge-tree` sin conflictos para las cuatro ramas.

## Incidencias

- Las primeras versiones del escape en `PersonJsonLd.tsx` quedaron con una sola barra invertida, así que no escapaban nada. Se detectó revisando los bytes (`od -c`) y se corrigió antes del commit.
- El script que borra "Experiencia" no encontraba los bloques por los saltos de línea CRLF del working copy (`core.autocrlf=true`). Se normalizó a LF al leer y se volvió a CRLF al escribir.

## Pendiente del humano

1. T-001: `npm audit fix` en `frontend/` (vulnerabilidades altas en `react-router` y `zod`).
2. Instalar las herramientas 🟡 para seguir con F2b (Playwright y axe) y después F3–F9.
3. Instalar gitleaks para cerrar F1 punto 1.
4. Revisar e integrar las ramas a `main`, push y despliegue. Orden sugerido: `fix/hero-title`, `migr/f1-seguridad`, `migr/f2-formato-sdd`, `migr/f7-codigo-muerto`.
5. Shadow: las fases no tienen todavía la evaluación del proveedor contrario.
