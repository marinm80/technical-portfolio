const es = {
  nav: {
    overview: "Resumen",
    experience: "Experiencia",
    projects: "Proyectos",
    blog: "Artículos",
    contact: "Contacto",
  },
  sidebar: {
    themeLight: "Modo claro",
    themeDark: "Modo oscuro",
  },
  home: {
    title: "Ingeniero de Software",
    subtitle: "especializado en React y Node.js",
    bio: "Transformo problemas complejos en sistemas escalables y eficientes. Enfocado en la calidad del código, arquitecturas limpias y experiencias de usuario excepcionales.",
    viewExp: "Ver Experiencia",
    viewProjects: "Ver Proyectos",
    linkedin: "LinkedIn",
    stack: "Stack Principal",
  },
  experience: {
    title: "Experiencia",
    subtitle: "Un resumen de mi trayectoria profesional y logros técnicos.",
    showMore: "Ver más",
    showLess: "Ver menos",
    // TODO(rafael): contenido placeholder — reemplazar con experiencia laboral real.
    items: {
      techcorp: {
        role: "Senior Frontend Engineer",
        company: "Tech Corp",
        period: "2021 — Presente",
        bullets: [
          "Lideré la migración de una arquitectura monolítica a micro-frontends reduciendo el tiempo de build en un 40%.",
          "Implementé un sistema de diseño utilizando React y Tailwind CSS, estandarizando componentes para 5 equipos.",
          "Optimicé el Core Web Vitals alcanzando un score de 95+ en Lighthouse a través de lazy loading avanzado y SSR.",
          "Mentoricé a nuevos ingenieros durante su proceso de onboarding, reduciendo el tiempo de rampa en un 30%.",
          "Establecí pautas estrictas de revisión de código garantizando la mantenibilidad a largo plazo.",
        ],
      },
      startup: {
        role: "Fullstack Developer",
        company: "Startup Inc",
        period: "2018 — 2021",
        bullets: [
          "Desarrollé APIs RESTful en Node.js y Express gestionando más de 1M de peticiones diarias.",
          "Diseñé esquemas de bases de datos relacionales en PostgreSQL para sistemas de facturación complejos.",
          "Integré pasarelas de pago de terceros (Stripe, PayPal) asegurando la compatibilidad PCI-DSS.",
          "Desplegué infraestructura escalable usando AWS ECS y balanceadores de carga clásicos.",
        ],
      },
    },
  },
  projects: {
    title: "Proyectos Destacados",
    subtitle: "Una selección de sistemas y aplicaciones que he construido.",
    viewProject: "Ver Proyecto",
    items: {
      taskManager: {
        description:
          "API REST de gestión de tareas con autenticación JWT, rate limiting, endpoint de salud y recuperación de contraseña. Desplegada con Docker detrás de Nginx Proxy Manager.",
      },
      portfolio: {
        description:
          "Este mismo sitio: SPA en React 19 con TypeScript estricto, Tailwind CSS 4, i18n (es/en), tests con Vitest y CI/CD con GitHub Actions hacia un VPS.",
      },
      omDistribution: {
        description:
          "Plataforma web para una distribuidora de alimentos en EE. UU.: landing page y gestión interna sobre TypeScript y MySQL, contenedorizada con Docker.",
      },
      SG_Remesas: {
        description:
          "Plataforma full-stack para gestionar remesas, clientes, cuentas y beneficiarios: paneles por rol, autenticación JWT con permisos RBAC, verificación KYC y alertas AML. Construida con React, Node.js, Express, PostgreSQL y Docker.",
      },
    },
  },
  blog: {
    title: "Escritos & Artículos",
    subtitle: "Pensamientos sobre ingeniería de software, arquitectura y la web.",
    loading: "Cargando artículos...",
    error: "No se pudieron cargar los artículos. Inténtalo de nuevo más tarde.",
    empty: {
      title: "Próximamente",
      description: "Estoy preparando el blog. Los primeros artículos llegarán pronto.",
    },
    readArticle: "Leer artículo",
  },
  contact: {
    title: "Contacto",
    subtitle: "¿Tienes un proyecto en mente o una oportunidad laboral? Hablemos.",
    name: "Nombre",
    email: "Email",
    message: "Mensaje",
    placeholder: {
      name: "Tu nombre",
      email: "tu@email.com",
      message: "Detalla tu propuesta aquí...",
    },
    submit: "Enviar Mensaje",
    submitting: "Enviando...",
    success: {
      title: "¡Mensaje enviado!",
      message: "Te responderé lo más pronto posible.",
    },
    errorSend: "No se pudo enviar el mensaje. Escríbeme directamente a {{email}}.",
    notConfigured: "El formulario de contacto no está disponible todavía. Escríbeme a",
    validation: {
      nameMin: "El nombre debe tener al menos 2 caracteres.",
      emailInvalid: "Debe ser un email válido.",
      messageMin: "El mensaje debe tener al menos 10 caracteres.",
    },
  },
  errorBoundary: {
    title: "Algo salió mal",
    message: "Ha ocurrido un error inesperado. Intenta recargar la página.",
    reload: "Recargar página",
  },
  meta: {
    home: {
      title: "Rafael Marin | Software Engineer",
      description:
        "Portafolio técnico de Rafael Marin, Ingeniero de Software especializado en React y Node.js.",
    },
    experience: {
      title: "Experiencia | Rafael Marin",
      description: "Trayectoria profesional y logros técnicos de Rafael Marin.",
    },
    projects: {
      title: "Proyectos | Rafael Marin",
      description: "Proyectos y sistemas construidos por Rafael Marin.",
    },
    blog: {
      title: "Artículos | Rafael Marin",
      description: "Artículos sobre ingeniería de software, arquitectura y desarrollo web.",
    },
    contact: {
      title: "Contacto | Rafael Marin",
      description: "Ponte en contacto con Rafael Marin para proyectos u oportunidades.",
    },
  },
};

export default es;
