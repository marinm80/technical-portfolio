# Informe de sesión · 2026-11-23 · Revisión Pre-Producción de Seguridad (Gate 4)

## Contexto

El usuario invocó el comando `/security-preprod-review` para realizar la auditoría de seguridad pre-producción (Gate 4) conforme al SDD v5 y el skill `security-preprod-review`.

## SHA evaluado

- **SHA:** `749b964b816de7e4b43ffd44f03491a90314c53c` (HEAD de `main`, coincidente con el commit actualmente desplegado en producción).

## Qué se hizo

Comandos ejecutados (exclusivamente 🟢 de lectura, build, tests y linters):
1. Verificación del estado de Git, ramas activas e historial de commits (`git status`, `git branch -a`, `git log`).
2. Escaneo de secretos en el historial completo de 58 commits con `gitleaks 8.30.1`: **0 filtraciones encontradas** (TX-01 / AS-06 cumplido).
3. Auditoría de dependencias de producción y desarrollo (`npm audit --omit=dev`, `npm audit`).
4. Verificación de frontend: búsqueda exhaustiva de XSS (`dangerouslySetInnerHTML`, manipulación de DOM), CSP en `nginx.conf`, source maps y almacenamiento de tokens en `localStorage`.
5. Ejecución limpia de build de producción (`npm run build` en `frontend/`): empaquetado exitoso, sin source maps emitidos en `dist/`.
6. Ejecución de la suite completa de tests (`NODE_OPTIONS=--no-experimental-webstorage npm test`): **12/12 archivos pasados, 83/83 tests en verde**.
7. Búsqueda activa de brechas no reportadas (PP-03): identificación de contenedor ejecutado como root (AS-08), falta de `server_tokens off;` y uso de `'unsafe-inline'` en CSP.
8. Generación del informe formal de Gate 4 en `docs/reports/security/2026-11-23_preprod-review.md`.

## Veredicto

🛑 **BLOQUEADO (Rechazado para despliegue a producción)** bajo la regla **PP-04**.

## Motivo del bloqueo y próximos pasos

- **Bloqueo:** Existen 2 vulnerabilidades de severidad **ALTA** en producción:
  - `zod <4.6.6` (GHSA-mrhx-c7xc-m3w5 - DoS por agotamiento de memoria).
  - `react-router <7.18.2` (GHSA-qwww-vcr4-c8h2, GHSA-chx6-hx7r-mcp5).
- **Acción requerida (Humano 🟡):** Ejecutar `npm audit fix` en `frontend/` (Tarea T-001 de migración).
- **Siguiente paso tras corrección:** Integrar las ramas `fix/hero-title`, `migr/f1-seguridad`, `migr/f2-formato-sdd` y `migr/f7-codigo-muerto`, y re-ejecutar `/security-preprod-review` sobre el nuevo SHA resultante (PP-05).
