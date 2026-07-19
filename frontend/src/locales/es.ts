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
    title: "Full Stack Developer",
    subtitle: "especializado en React y Node.js",
    bio: "Transformo problemas complejos en sistemas escalables y eficientes, con conocimientos sólidos de Docker y Linux para desplegar y operar lo que construyo. Enfocado en la calidad del código y en arquitecturas limpias.",
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
    relatedPosts: "Artículos sobre este proyecto",
    items: {
      taskManager: {
        description:
          "Taskly: SaaS de gestión de tareas con autenticación JWT, dashboard con filtros y métricas, exportación a CSV y recuperación de contraseña. Construido con React, Node.js, Express, PostgreSQL y Docker.",
      },
      omDistribution: {
        description:
          "Plataforma web para una distribuidora de alimentos en EE. UU.: landing page pública y gestión interna de inventario. Construida con React, Node.js, Express, MySQL y Docker.",
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
      title: "Euclides Rafael Marin | Full Stack Developer",
      description:
        "Portafolio técnico de Euclides Rafael Marin, Full Stack Developer especializado en React y Node.js.",
    },
    experience: {
      title: "Experiencia | Euclides Rafael Marin",
      description: "Trayectoria profesional y logros técnicos de Euclides Rafael Marin.",
    },
    projects: {
      title: "Proyectos | Euclides Rafael Marin",
      description: "Proyectos y sistemas construidos por Euclides Rafael Marin.",
    },
    blog: {
      title: "Artículos | Euclides Rafael Marin",
      description: "Artículos sobre ingeniería de software, arquitectura y desarrollo web.",
    },
    contact: {
      title: "Contacto | Euclides Rafael Marin",
      description: "Ponte en contacto con Euclides Rafael Marin para proyectos u oportunidades.",
    },
  },
};

export default es;
