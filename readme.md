# 🌐 Technical Portfolio — rafaelmarin.dev

[![CI/CD Pipeline](https://github.com/marinm80/technical-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/marinm80/technical-portfolio/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Portfolio profesional de **Rafael Marin**, en producción en **[rafaelmarin.dev](https://rafaelmarin.dev)**. El portfolio es un proyecto técnico en sí mismo: SPA en React 19 con TypeScript estricto, internacionalización completa, theming claro/oscuro, tests con Vitest y CI/CD hacia un VPS con Docker.

---

## ✨ Features

* **🌐 Multilingüe (ES / EN):** i18next con detección automática del idioma del navegador (`i18next-browser-languagedetector`), persistencia en `localStorage` y toggle manual desde el sidebar. Traducciones en módulos TypeScript (`src/locales/`) con paridad de keys verificada en compile-time vía `satisfies`.
* **🌗 Tema claro/oscuro:** `ThemeContext` (Context API) con persistencia en `localStorage`, respeto de `prefers-color-scheme` y script anti-FOUC. El theming usa tokens semánticos de CSS variables con la variante `dark` de Tailwind 4 (`@custom-variant`).
* **✍️ Blog vía WordPress REST API:** la sección de artículos consume `wp/v2/posts` (últimos 10) con validación de contrato en runtime usando Zod. Sin `VITE_WP_API_URL` configurada, degrada a un estado vacío honesto — sin errores ni contenido falso.
* **📬 Contacto con EmailJS:** formulario validado con Zod + React Hook Form que envía por `@emailjs/browser`. Sin credenciales configuradas, muestra un fallback `mailto:`.
* **⚡ Code splitting:** páginas cargadas con `React.lazy` + `Suspense` (skeleton de carga en el layout).
* **🛡️ Error Boundary:** captura errores de render y muestra un fallback traducido con opción de recarga.
* **🔎 SEO:** metadata nativa de React 19 (`<title>`/`<meta>` con hoisting automático por página vía componente `Seo`), meta tags OG/Twitter y canonical en `index.html`.
* **🎨 Animaciones:** transiciones de entrada y `AnimatePresence` con Framer Motion.

## 🛠️ Stack

| Capa | Tecnología |
| --- | --- |
| UI | React 19, Framer Motion, lucide-react |
| Lenguaje | TypeScript (`strict: true`) |
| Build | Vite 8 |
| Estilos | Tailwind CSS 4 (tokens semánticos + dark variant) |
| Formularios | React Hook Form + Zod (validación runtime) |
| i18n | i18next + react-i18next + browser-languagedetector |
| Testing | Vitest + React Testing Library + jsdom |
| CI/CD | GitHub Actions (lint → type-check → test → build) |
| Deploy | Docker multi-stage → Nginx → Nginx Proxy Manager (VPS) |

## 📁 Estructura

```
frontend/src/
├── components/   # Sidebar, Seo, ErrorBoundary, iconos SVG propios
├── context/      # ThemeContext (claro/oscuro)
├── data/         # profile, experience, projects (estructura; la prosa vive en locales/)
├── layouts/      # MainLayout (sidebar fija desktop / drawer mobile + Suspense)
├── lib/          # utilidades compartidas (cn)
├── locales/      # es.ts / en.ts (paridad de keys en compile-time)
├── pages/        # Home, Experience, Projects, Blog, Contact (+ tests)
├── services/     # wordpress.ts, email.ts (+ tests)
├── test/         # setup, test-utils (render con providers), routing tests
└── types/        # interfaces compartidas + contrato WordPress
```

## 🚀 Desarrollo local

Requisitos: **Node.js 22**.

```bash
cd frontend
npm ci
npm run dev
```

### Variables de entorno (opcionales)

Copia `.env.example` a `.env`. **Todas son opcionales** — sin ellas el sitio funciona en modo degradado (blog vacío, contacto con `mailto:`). Vite las inyecta en **build time**.

| Variable | Uso |
| --- | --- |
| `VITE_WP_API_URL` | URL base del WordPress del blog (sin `/wp-json`) |
| `VITE_EMAILJS_SERVICE_ID` | Service ID de EmailJS |
| `VITE_EMAILJS_TEMPLATE_ID` | Template ID de EmailJS (variables `{{name}}`, `{{email}}`, `{{message}}`) |
| `VITE_EMAILJS_PUBLIC_KEY` | Public key de EmailJS |

> Las claves `VITE_*` son públicas por diseño (van en el bundle del cliente). La protección real del formulario es el allowlist de dominios en el dashboard de EmailJS.

## 🧪 Testing

```bash
npm test              # suite completa (Vitest, 81 tests)
npm run test:watch    # modo watch
npm run test:coverage # con cobertura
```

Cubre: validación del formulario (edge cases), interacción de toggles (idioma y tema), routing con lazy loading y redirects, estados del blog (loading/éxito/vacío/error) con el servicio mockeado, contrato de la API de WordPress (Zod), servicio de email y Error Boundary. `test/test-utils.tsx` re-exporta React Testing Library con los providers (Theme + Router).

## 🔄 CI/CD y Deploy

**CI** (GitHub Actions, Node 22): `npm ci` → ESLint → `tsc -b` → `npm test` → `vite build`.

**Deploy**: Docker Compose con imagen multi-stage ([frontend/Dockerfile](frontend/Dockerfile): build con Node 22 → runtime `nginx:alpine`), desplegado en un VPS con **Coolify** (Build Pack: *Docker Compose*, location `/docker-compose.yml`). Coolify termina el TLS y enruta el dominio hacia el puerto 80 del contenedor; las `VITE_*` se definen como Environment Variables en Coolify y se interpolan como build args. El nginx interno sirve la SPA con gzip, headers de seguridad (CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) y cache inmutable para los assets con hash.

```bash
# Prueba local (publica el puerto 8080 del host):
cp .env.example .env   # completar las VITE_*
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

> Las `VITE_*` se inyectan en **build time**: tras cambiarlas (en Coolify o en `.env`) hay que reconstruir/redesplegar.

## 🗺️ Roadmap

* [ ] Desplegar el blog en WordPress y configurar `VITE_WP_API_URL` (el frontend ya está listo; WP deberá permitir CORS desde `https://rafaelmarin.dev`)
* [ ] Reemplazar el contenido placeholder de la sección Experiencia con la trayectoria real
* [ ] Imagen `og-image` real para las cards de redes sociales
* [ ] CV descargable en PDF

## 📫 Contacto

**Rafael Marin** — [rafaelmarin.dev](https://rafaelmarin.dev) · [GitHub](https://github.com/marinm80) · [LinkedIn](https://www.linkedin.com/in/euclides-rafael-marin/)
