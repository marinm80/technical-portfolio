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
| Deploy | Dockerfile multi-stage → Nginx → Traefik/Coolify (VPS) |

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

**Deploy**: sitio estático empaquetado por [frontend/Dockerfile](frontend/Dockerfile) con build multi-stage (Node 22 → `nginx:alpine`). En **Coolify** se configura como aplicación con Build Pack **Dockerfile**, Base Directory `/frontend`, Dockerfile Location `/Dockerfile` y puerto `80`. El portfolio se ejecuta como un único contenedor aislado; el blog se consume mediante su API pública HTTPS.

Las variables `VITE_*` se crean en Coolify como **Environment Variables** y se marcan también como **Build Variable**, porque Vite las inyecta al compilar. Coolify termina TLS con Traefik y enruta `rafaelmarin.dev` y `www.rafaelmarin.dev` al puerto 80. El Nginx interno conserva el fallback de SPA, gzip, headers de seguridad y caché inmutable para assets con hash.

```bash
# Build local de la imagen estática
docker build -t technical-portfolio ./frontend

# Prueba local en http://localhost:8080
docker run --rm -p 8080:80 technical-portfolio
```

> Las `VITE_*` se inyectan en **build time**: tras cambiarlas (en Coolify o en `.env`) hay que reconstruir/redesplegar.

## 🗺️ Roadmap

* [ ] Reactivar la sección Experiencia con la trayectoria real (hoy está oculta del nav y el router; la página, datos y traducciones quedan listos)
* [ ] Imagen `og-image` real para las cards de redes sociales (`twitter:card` está en `summary`, no `summary_large_image`, hasta que exista la imagen)
* [ ] CV descargable en PDF
* [ ] Decidir si vale la pena prerender/SSR: hoy es una SPA pura (sin contenido inicial en el HTML) y las rutas desconocidas devuelven HTTP 200 con redirect a Home en vez de un 404 real
* [ ] Evaluar si conviene URLs separadas por idioma (`/en/...`) para que Google pueda indexar también la versión en inglés — hoy el toggle es 100% client-side sobre la misma URL

## 📫 Contacto

**Rafael Marin** — [rafaelmarin.dev](https://rafaelmarin.dev) · [GitHub](https://github.com/marinm80) · [LinkedIn](https://www.linkedin.com/in/euclides-rafael-marin/)
