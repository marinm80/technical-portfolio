# 🌐 Portafolio Técnico Personal Multilingüe

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-blue?style=flat-for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat-for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

Un portafolio profesional desarrollado bajo el concepto de **"proyecto técnico en sí mismo"**. Este espacio no solo recopila mis desarrollos, sino que sirve como demostración activa de estándares de ingeniería de software robustos: TypeScript estrictamente tipado, control defensivo de errores, optimización de bundles en el lado del cliente (SPA), internacionalización y un blog técnico dinámico integrado con MDX.

---

## 📸 Previsualización

### Vista Escritorio (Modo Claro vs. Modo Oscuro)
| Modo Claro | Modo Oscuro |
| :---: | :---: |
| ![Modo Claro](https://via.placeholder.com/600x350?text=Desktop+Light+Mode) | ![Modo Oscuro](https://via.placeholder.com/600x350?text=Desktop+Dark+Mode) |

### Vista Móvil (Responsive)
| Mobile Light | Mobile Dark |
| :---: | :---: |
| ![Móvil Claro](https://via.placeholder.com/250x450?text=Mobile+Light+Mode) | ![Móvil Oscuro](https://via.placeholder.com/250x450?text=Mobile+Dark+Mode) |

---

## ✨ Características Principales

* **🌐 Soporte Multilingüe (ES / EN):** Internacionalización dinámica administrada mediante `i18next`. Detecta automáticamente el idioma de preferencia del navegador y permite alternar instantáneamente desde la interfaz sin recargas de página.
* **🌗 Tema Claro/Oscuro Nativo:** Sincronizado mediante React Context (`ThemeContext`) y clases CSS de Tailwind, persistiendo de manera segura la configuración seleccionada en el `localStorage`.
* **✍️ Blog Técnico con MDX:** Los artículos del blog se estructuran en archivos `.mdx` locales, permitiendo inyectar dinámicamente componentes React personalizados y bloques de código con resaltado sintáctico profesional.
* **🎨 Animaciones de Alto Rendimiento:** Transiciones fluidas mediante `Framer Motion`, "scroll-reveal" en el timeline de experiencia y un motor de filtrado interactivo en la galería de proyectos sin penalizar la tasa de refresco del cliente.
* **📩 Contacto Serviceless Seguro:** Formulario funcional integrado con `EmailJS`. La validación en tiempo de ejecución de los campos se procesa de forma estricta mediante `React Hook Form` y un esquema robusto de `Zod`.
* **⚡ Carga Diferida y SEO:** División de código (*code splitting*) a través de `React.lazy()` y `Suspense` para una óptima velocidad de carga inicial, junto con metatags Open Graph dinámicos controlados por `react-helmet`.

---

## 🛡️ Estándares de Ingeniería y Calidad de Código

Para certificar la solidez técnica de este portafolio ante líderes de equipo y arquitectos de software, el código ha sido desarrollado aplicando reglas defensivas de programación:

### 1. TypeScript Ultra-Estricto (Cero `any`)
* El archivo `tsconfig.json` está configurado con `strict: true`.
* **Prohibido el uso de `any`:** Toda API externa o importación dinámica (como los payloads MDX de artículos o respuestas del formulario de contacto) se tipa inicialmente con `unknown` y se parsea en tiempo de ejecución utilizando esquemas de validación de **Zod**.
* Tipado explícito de retornos en funciones, hooks personalizados, y definición estricta de las interfaces de propiedades (*props*) para todos los componentes de React.

### 2. Cláusulas de Guarda (No `if` anidados)
* Se eliminó el anidamiento profundo de condicionales para evitar el código en "forma de flecha" y mantener la legibilidad de la lógica.
* Toda validación previa, comprobación de estado nulo o manejo rápido de errores se ejecuta mediante retornos prematuros (*early returns*) al inicio de las funciones, aislando el flujo feliz del componente en el cuerpo principal.

### 3. Gestión Defensiva de Errores (`try-catch` asíncronos)
* Toda interacción con recursos del sistema o llamadas asíncronas externas (como el envío de emails con `EmailJS` o la lectura perezosa de rutas MDX) está blindada dentro de bloques `try-catch`.
* En lugar de capturar errores genéricos, los flujos asíncronos manejan bloques de excepción tipados mediante un validador de instancias (`error instanceof Error`) asegurando una respuesta controlada en la UI en caso de caídas de red o fallas del servicio.

### 4. Complejidad Ciclomática Limitada
* El código se mantiene modularizado. Las funciones de renderizado, filtrado y formateo de datos están limitadas en su alcance lógico. Si una función supera los 10 caminos de ejecución posibles (bifurcaciones), es refactorizada obligatoriamente en helpers puros, declarativos y testeables.

---

## 🛠️ Tecnologías Utilizadas

* **Core:** React (Vite) + TypeScript
* **Estilos:** Tailwind CSS, `@tailwindcss/typography`
* **Animación:** Framer Motion, `react-type-animation`
* **Internacionalización:** `i18next`, `react-i18next`
* **Manejo de Formularios & Tipado:** React Hook Form, Zod
* **Parser de Blog:** `@mdx-js/react`, `remark-gfm`, `react-syntax-highlighter`
* **Integración de Email:** `@emailjs/browser`
* **SEO:** `react-helmet`

---

## 📁 Estructura del Proyecto

```text
technical-portfolio/
├── frontend/                  # Aplicación React con TypeScript
│   ├── content/               # Artículos del blog en formato MDX
│   │   └── posts/
│   │       ├── mi-primer-articulo.mdx
│   │       └── optimizaciones-react.mdx
│   ├── public/
│   │   └── cv.pdf             # Archivo descargable de Currículum Vitae
│   ├── src/
│   │   ├── assets/            # Imágenes, iconos y recursos multimedia
│   │   ├── components/        # Componentes UI reutilizables (*.tsx)
│   │   ├── context/           # ThemeContext para el modo claro/oscuro (*.tsx)
│   │   ├── locales/           # Diccionarios JSON de traducciones (ES / EN)
│   │   │   ├── en/
│   │   │   │   └── translation.json
│   │   │   └── es/
│   │   │       └── translation.json
│   │   ├── pages/             # Páginas principales (*.tsx)
│   │   ├── utils/             # Configuración de i18n, helpers y tipos (*.ts)
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 🚀 Instalación y Configuración Local

Sigue estos pasos para desplegar el entorno de desarrollo en tu máquina local.

### Prerrequisitos
- **Node.js**: `>= 18.x`
- **Gestor de paquetes**: `npm` o `pnpm`

### Pasos
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/technical-portfolio.git
   cd technical-portfolio/frontend
   ```
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Configurar variables de entorno:**
   Copia el archivo de ejemplo y configura tus credenciales de EmailJS u otros servicios.
   ```bash
   cp .env.example .env.local
   ```
4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🔐 Variables de Entorno

Para que el formulario de contacto (y otros servicios) funcionen correctamente, debes crear un archivo `.env.local` en la raíz de `frontend/` con las siguientes variables:

```env
# Configuración de EmailJS (Serviceless Contact Form)
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
```

---

## 📜 Scripts Disponibles

En el directorio del frontend, puedes ejecutar los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo en modo hot-reload.
- `npm run build`: Compila la aplicación para producción con minificación y optimización de assets.
- `npm run preview`: Levanta un servidor local estático para probar la build de producción generada.
- `npm run lint`: Ejecuta ESLint para analizar el código en busca de errores y asegurar la adherencia a las reglas configuradas.

---

## 🧪 Estrategia de Pruebas (Próximamente)

La arquitectura actual está preparada para la integración de pruebas automatizadas, enfocándose en:
- **Unit Testing:** Vitest para probar lógica aislada y custom hooks.
- **Component Testing:** React Testing Library para aserciones de la UI.
- **E2E Testing:** Cypress o Playwright para asegurar flujos completos (ej. cambio de idioma, envío de formulario).

*(Comando reservado: `npm run test`)*

---

## 🚢 Despliegue y CI/CD

El proyecto está preparado para ser desplegado en plataformas modernas de hosting estático o serverless (ej. Vercel, Netlify, Render).
- **Integración Continua (CI):** Se configurarán flujos de GitHub Actions para ejecutar estáticamente `tsc --noEmit` y `npm run lint` bloqueando Pull Requests que no cumplan los estándares de calidad del proyecto.

---

## 🚦 Métricas de Rendimiento (Lighthouse)

El proyecto prioriza un rendimiento de nivel superior. (Aquí puedes colocar tu captura de pantalla real una vez la tengas).

![Lighthouse Score](https://via.placeholder.com/800x200?text=Lighthouse+Score:+100+Performance,+100+Accessibility,+100+Best+Practices,+100+SEO)

---

## 🤝 Convenciones de Git y Desarrollo

Para mantener un historial limpio y profesional, el repositorio sigue metodologías de la industria:
- **Conventional Commits:** Todos los commits siguen el formato `<tipo>[scope opcional]: <descripción>`. (Ej. `feat: add i18n support`, `fix(ui): resolve dark mode toggle glitch`).
- **Trunk Based Development / Git Flow:** Se utilizan ramas descriptivas (`feature/*`, `bugfix/*`) que pasan por revisión (PR) antes de integrarse a la rama principal.

---

## 📄 Licencia y Contacto

**Licencia:** Distribuido bajo la licencia [MIT](LICENSE). Siéntete libre de usar este código como referencia o plantilla.

**Contacto:**
- **LinkedIn:** [Tu Nombre](https://linkedin.com/in/tu-perfil)
- **Email:** [tu_correo@ejemplo.com](mailto:tu_correo@ejemplo.com)
- **Live Demo:** [https://tu-dominio.com](https://tu-dominio.com)

---

## 📋 Planificación y Diseño (Roadmap)

Para garantizar un desarrollo ordenado y una arquitectura sólida, el proyecto se divide en los siguientes hitos y tareas. El diseño base es un **Layout con Menú Lateral (Sidebar)**, inspirado en herramientas de desarrollo profesional (estilos IDE/Documentación), priorizando rutas reales y directas al grano, descartando el formato de "landing page de un solo scroll".

### Fase 1: Arquitectura Base y UI/UX Core
- [x] **Tarea 1.1: Configuración de Layout Principal.** Crear el componente `Sidebar` persistente (menú lateral responsivo) y el contenedor principal para las vistas (`MainLayout`).
- [x] **Tarea 1.2: Definición de Tema y Tipografía.** Configurar en Tailwind el tema oscuro corporativo (tonos grafito/obsidiana), el color de acento único, tipografía Sans-serif (ej. Inter) para lectura y Monospaced (ej. Fira Code) para etiquetas técnicas.
- [x] **Tarea 1.3: Sistema de Enrutamiento.** Configurar React Router (o sistema del framework) para las rutas principales: `/`, `/experience`, `/projects`, `/blog`.

### Fase 2: Desarrollo de Vistas Principales (Directo al Grano)
- [x] **Tarea 2.1: Vista Inicio (`/`).** Crear el titular impactante ("Gancho"), resumen ejecutivo corto y acceso rápido a "Experiencia" y "CV".
- [x] **Tarea 2.2: Vista Experiencia (`/experience`).** Maquetar tarjetas de experiencia laboral priorizando el impacto técnico y arquitectura (viñetas de logros).
- [x] **Tarea 2.3: Vista Proyectos (`/projects`).** Construir el grid de proyectos con enfoque en los desafíos resueltos, stack utilizado y enlaces a repositorios.

### Fase 3: Funcionalidades Dinámicas y Pulido
- [x] **Tarea 3.1: Micro-interacciones (Framer Motion).** Añadir transiciones de página fluidas (fade-in sutil) y efectos de *hover* técnicos que refuercen la experiencia premium.
- [ ] **Tarea 3.2: Motor del Blog Técnico (MDX).** Asegurar la correcta renderización de artículos locales `.mdx` en la ruta `/blog` con resaltado de sintaxis en el código.
- [x] **Tarea 3.3: Internacionalización (i18n).** Implementar la lógica para el cambio instantáneo entre Español e Inglés gestionado desde el Sidebar.
- [x] **Tarea 3.4: Formulario de Contacto.** Integrar y validar el componente de contacto *Serviceless* con EmailJS, React Hook Form y Zod.

### Fase 4: Optimización, Pruebas y Despliegue
- [x] **Tarea 4.1: Auditoría Lighthouse y SEO.** Asegurar puntuaciones perfectas en rendimiento y accesibilidad, además de configurar metadatos dinámicos.
- [x] **Tarea 4.2: CI/CD y Testing Base.** Configurar pipelines de GitHub Actions (Lint + Types) y sentar las bases para pruebas unitarias.
- [ ] **Tarea 4.3: Despliegue a Producción.** Despliegue del portafolio en Vercel, Netlify o Render y pruebas finales en vivo.