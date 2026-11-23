# Revisión Pre-Producción de Seguridad (Gate 4) · technical-portfolio

**Fecha:** 2026-11-23  
**SHA Evaluado (Release Candidate / Main actual):** `749b964b816de7e4b43ffd44f03491a90314c53c`  
**Supervisor AppSec:** Antigravity (SDD v5)  
**Skill:** `security-preprod-review` (v1.0.0)  
**Veredicto Gate 4:** 🛑 **BLOQUEADO (No apto para despliegue)** por regla **PP-04** (Cero críticos y altos abiertos).

---

## 1. Resumen Ejecutivo y Veredicto

De acuerdo con las reglas de gobierno del SDD v5 y el skill `security-preprod-review` (reglas PP-01 a PP-05):
- Se evaluó el SHA exacto congelado en `main` (`749b964b816de7e4b43ffd44f03491a90314c53c`).
- Las **seis capas** fueron auditadas de forma sistemática y exhaustiva.
- Se identificaron **2 vulnerabilidades de severidad ALTA en dependencias de producción** (`react-router` y `zod`), lo que activa el criterio de parada obligatoria:
  > *"Crítica o alta: Bloquea. Vuelve como tarea al dominio y se repite la revisión de esa capa."* (PP-04).
- Adicionalmente, el Shadow AppSec identificó **gaps no reportados** en contenedor (ejecución como `root`), CSP (`'unsafe-inline'` por script anti-FOUC) y divulgación de versión en Nginx (`server_tokens` activo).
- La rama `migr/f1-seguridad` ya contiene mitigaciones para CI y escape de JSON-LD, pero aún no ha sido integrada ni se ha ejecutado la remediación de paquetes (`npm audit fix`).

---

## 2. Matriz de Hallazgos por Capa

| Capa | Estado | Severidad Máxima | Hallazgo Principal / Justificación |
|---|---|---|---|
| **Frontend** | ⚠️ Parcial | Media | Falta escape de `<` en JSON-LD (en `main`); CSP permisivo con `'unsafe-inline'` para scripts; falta límite de longitud en formulario de contacto. |
| **Backend** | 🟢 Cumple (N/A) | N/A | **Justificación (PP-02):** SPA estática sin backend propio ni endpoints expuestos. Integraciones client-side con EmailJS y WordPress REST API. |
| **Base de Datos**| 🟢 Cumple (N/A) | N/A | **Justificación (PP-02):** Sin base de datos ni motor relacional/NoSQL en servidor. |
| **Infraestructura** | ⚠️ Parcial | Media | Contenedor corre como `root` en `nginx:alpine` (AS-08); falta `server_tokens off;` en `nginx.conf`. |
| **Cadena de Suministro** | 🛑 **Bloquea** | **Alta** | **2 CVEs Altos abiertos en producción:** `zod <4.6.6` (GHSA-mrhx-c7xc-m3w5) y `react-router <7.18.2` (GHSA-qwww-vcr4-c8h2, GHSA-chx6-hx7r-mcp5). Actions de CI sin SHA ni `permissions`. |
| **Gaps & Contrato** | ⚠️ Parcial | Media | Ramas de migración `migr/f1-seguridad` y `fix/hero-title` pendientes de integración formal antes de release. |

---

## 3. Detalle de Auditoría por Capa

### 3.1. Frontend
- **XSS & Inyección:**
  - `frontend/src/components/PersonJsonLd.tsx`: En `main` (`749b964`), se renderiza `dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}` sin escapar `<`. Si bien los datos son locales, incumple RC-04 / ASVS al no usar `.replace(/</g, "\\u003c")`. *(Corregido en `migr/f1-seguridad`, pero pendiente en `main`)*.
  - Títulos y resúmenes de WordPress en `Blog.tsx` y `Projects.tsx`: Utilizan `DOMParser().parseFromString(html, "text/html")` y extraen `.textContent`. Se renderizan como strings seguros en React JSX.
- **CSP (Content Security Policy):**
  - Configurado en `frontend/nginx.conf`:
    `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com https://blog.rafaelmarin.dev; base-uri 'self'; form-action 'self'`
  - **Debilidad:** `script-src 'unsafe-inline'` está habilitado para permitir el script inline anti-FOUC en `index.html`.
  - **Faltantes:** `object-src 'none'` no está explícito; `frame-ancestors` falta (aunque `X-Frame-Options: SAMEORIGIN` está presente).
- **Secretos y URLs en bundle:**
  - Solo se inyectan variables `VITE_*` explícitas. Claves de EmailJS son de uso público por diseño.
- **Source Maps:**
  - `dist/assets/` verificado tras build de producción: **0 archivos `.map` generados** (deshabilitados correctamente).
- **Almacenamiento Cliente:**
  - `localStorage` solo se utiliza para persistencia de `theme` ("light" | "dark") y detección de idioma `i18nextLng`. Cero credenciales ni tokens de sesión.
- **Validación de Formularios:**
  - `Contact.tsx`: Valida con Zod (`min(2)` nombre, `email()`, `min(10)` mensaje).
  - *Mejora recomendada:* Falta `.max(...)` para evitar cargas desmedidas hacia EmailJS.

---

### 3.2. Backend
- **Estado:** No Aplica (Justificado según PP-02).
- **Evidencia:** El proyecto es 100% una Single Page Application estática servida por Nginx. No expone APIs propias, controladores, middlewares de backend, sesiones ni autenticación en servidor.

---

### 3.3. Base de Datos
- **Estado:** No Aplica (Justificado según PP-02).
- **Evidencia:** No existen conexiones ni motores de persistencia propios en el repositorio.

---

### 3.4. Infraestructura y Despliegue
- **Contenedor `frontend/Dockerfile`:**
  - **Hallazgo (AS-08):** La imagen final `FROM nginx:alpine` corre por defecto con `USER root` (UID 0).
  - *Recomendación:* Migrar a `nginxinc/nginx-unprivileged:alpine` o crear un usuario no root para cumplir la directiva de mínimos privilegios en tiempo de ejecución.
  - **Healthcheck:** Configurado y operativo:
    `HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1`
- **Cabeceras Nginx `frontend/nginx.conf`:**
  - Cabeceras de seguridad activas: `X-Content-Type-Options "nosniff"`, `X-Frame-Options "SAMEORIGIN"`, `Referrer-Policy "strict-origin-when-cross-origin"`, `Permissions-Policy "camera=(), microphone=(), geolocation=()"`.
  - **Hallazgo (Divulgación):** Falta `server_tokens off;`, permitiendo que Nginx anuncie su versión en la cabecera `Server`.
  - **HSTS:** Documentado correctamente que la terminación TLS y HSTS residen en el proxy inverso (Traefik / Coolify).

---

### 3.5. Cadena de Suministro (Supply Chain)
- **Vulnerabilidades de Dependencias (`npm audit --omit=dev`):**
  - 🛑 **ALTA:** `zod <4.6.6` (GHSA-mrhx-c7xc-m3w5 - DoS por agotamiento de memoria).
  - 🛑 **ALTA:** `react-router 6.0.0 - 7.18.1` (GHSA-qwww-vcr4-c8h2 CSRF bypass, GHSA-chx6-hx7r-mcp5 DoS por coincidencia ineficiente de rutas).
  - *Severidades totales en producción:* 2 Altas, 1 Baja.
  - *Severidades totales con devDependencies:* 9 Altas, 12 Moderadas, 2 Bajas.
- **CI / GitHub Actions (`.github/workflows/ci.yml`):**
  - En `main` (`749b964`), las acciones `actions/checkout@v4` y `actions/setup-node@v4` usan tags mutables y carecen de `permissions: contents: read` (incumplimiento SC-04).
- **Escaneo de Secretos (Historial completo):**
  - Herramienta: `gitleaks 8.30.1` (`gitleaks detect --log-opts="--all" --redact -v`).
  - Resultado: **58 commits escaneados · 0 filtraciones encontradas**. Cumple TX-01 y AS-06.

---

### 3.6. Gaps identificados por el Shadow (PP-03)

| ID | Hallazgo no reportado | Capa | Severidad | Acción Requerida |
|---|---|---|---|---|
| GAP-01 | Ejecución de contenedor Docker como `root` | Infra | Media | Adoptar `nginxinc/nginx-unprivileged:alpine`. |
| GAP-02 | Divulgación de versión de Nginx (`server_tokens` ausente) | Infra | Baja | Añadir `server_tokens off;` en bloque `server`. |
| GAP-03 | CSP con `script-src 'unsafe-inline'` | Frontend | Media | Sustituir `'unsafe-inline'` por el hash SHA-256 del script anti-FOUC de `index.html`. |
| GAP-04 | Ausencia de directiva `object-src 'none'` en CSP | Frontend | Baja | Añadir `object-src 'none'` a la cabecera CSP. |
| GAP-05 | Esquema Zod de contacto sin restricción máxima (`.max()`) | Frontend | Baja | Añadir `.max(100)` en nombre y `.max(5000)` en mensaje. |

---

## 4. Requisitos para Levantar el Bloqueo (Plan de Remediación)

Para que el Gate 4 sea **Aprobado** y se autorice el despliegue a producción, deben cumplirse las siguientes acciones:

1. **Remediación de Dependencias Críticas/Altas (Humano 🟡 - T-001):**
   - Ejecutar en `frontend/`: `npm audit fix` para actualizar `zod` a `>=4.6.6` y `react-router` a `>=7.18.2`.
   - Verificar que `npm audit --omit=dev` reporte **0 vulnerabilidades altas o críticas**.
2. **Integración de Ramas de Seguridad y Formato:**
   - Integrar `migr/f1-seguridad` (fijación SHA en CI y escape en JSON-LD).
   - Integrar `fix/hero-title` y `migr/f7-codigo-muerto` (limpieza de código muerto).
3. **Endurecimiento de Infraestructura (Recomendado antes del nuevo SHA):**
   - Añadir `server_tokens off;` a `frontend/nginx.conf`.
   - Evaluar cambio a imagen no root en `Dockerfile`.
4. **Re-evaluación sobre el nuevo SHA (PP-05):**
   - Una vez hechos los commits y la integración, ejecutar la re-evaluación de seguridad pre-producción sobre el nuevo SHA generado.
