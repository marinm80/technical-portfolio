# Informe de sesión · 2026-11-23 · Push y despliegue

## Pedido del humano

"Procede a hacer los pendientes que me dijiste, yo eliminaré la carpeta test-results".

## Qué se hizo

1. `task/t-006-npm-update` fusionada en `main` (`b4011b4`, `--no-ff`).
2. Prueba previa con Docker sobre `b4011b4`: `docker build` del `frontend/Dockerfile`, contenedor `healthy`. `/`, `/projects`, `/blog`, `/contact`, `/experience` y una ruta inexistente responden 200. El bundle contiene el nombre nuevo y no contiene "Tech Corp". Contenedor retirado.
3. Worktree temporal retirado con `git worktree remove`.
4. `git push origin main`: `749b964..b4011b4`, 26 commits.
5. CI `45227585347` en verde: lint, typecheck, tests unitarios en Node 22 sin flag (confirma la causa de H1), build y batería de caracterización en Linux (39 pasan y 1 se salta; las 16 `@visual` son solo locales). T-004 cerrada.

## Despliegue: no ocurrió (T-009)

- El push a `main` dispara el build en Coolify según `specs/static-coolify-deploy/plan.md:9`, pero después de unos 10 minutos de sondeo `https://rafaelmarin.dev` sigue sirviendo `assets/index-C9sSQ8ZB.js`.
- Ese bundle ya estaba publicado antes del push (apareció en la primera consulta, a los ~20 s). Contiene el subtítulo nuevo del Home y también la sección Experiencia ("Tech Corp", "Startup Inc", "Ver Experiencia"), así que se construyó desde un commit con `fix/hero-title` pero sin F7. No se pudo determinar quién lo desplegó ni desde qué ref.
- En GitHub el repo no tiene webhooks (`gh api .../hooks` vacío) ni registros de despliegue. La conexión con Coolify, si existe, pasa por su GitHub App o se hace a mano.
- No se tocó Coolify: no hay acceso desde esta sesión, y desplegar es una acción 🔴 del humano.

## Tareas nuevas

- T-008: subir `checkout` y `setup-node` a una versión que no use Node 20 (aviso del CI).
- T-009: revisar el recurso de Coolify y desplegar `main`.

## Pendiente del humano

1. En Coolify, revisar la rama configurada, si el despliegue automático está activo y qué commit tiene el último despliegue. Después, desplegar `main` (`b4011b4` o posterior).
2. Borrar `frontend/test-results/` (dicho por el humano).
3. Revisar la animación de entrada con `framer-motion` 14 una vez desplegado.
