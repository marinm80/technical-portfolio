import type es from "./es";

// `satisfies` garantiza en compile-time la paridad de keys con es.ts.
type TranslationSchema = typeof es;

const en = {
  nav: {
    overview: "Overview",
    projects: "Projects",
    blog: "Writing",
    contact: "Contact",
  },
  sidebar: {
    themeLight: "Light mode",
    themeDark: "Dark mode",
  },
  home: {
    title: "Euclides Rafael Marin",
    subtitle: "Full Stack Developer specialized in React & Node.js",
    bio: "I transform complex problems into scalable and efficient systems, with solid Docker and Linux skills to deploy and operate what I build. Focused on code quality and clean architectures.",
    viewProjects: "View Projects",
    linkedin: "LinkedIn",
    github: "GitHub",
    stack: "Main Stack",
    stackCategories: {
      languages: "Languages",
      frontend: "Frontend",
      backend: "Backend",
      database: "Databases",
      devops: "DevOps",
    },
  },
  projects: {
    title: "Featured Projects",
    subtitle: "A selection of systems and applications I have built.",
    viewProject: "View Project",
    relatedPosts: "Articles about this project",
    items: {
      taskManager: {
        description:
          "Taskly: a task management SaaS with JWT authentication, a dashboard with filters and metrics, CSV export and password recovery. Built with React, Node.js, Express, PostgreSQL and Docker.",
      },
      omDistribution: {
        description:
          "Web platform for a food distribution company in the US: public landing page and internal inventory management. Built with React, Node.js, Express, MySQL and Docker.",
      },
      SG_Remesas: {
        description:
          "Full-stack platform to manage remittances, clients, accounts and beneficiaries: role-based dashboards, JWT authentication with RBAC permissions, KYC verification and AML alerts. Built with React, Node.js, Express, PostgreSQL and Docker.",
      },
      salvia: {
        description:
          "Telemedicine platform with database-level non-overlapping appointment booking, chat consultations with electronically signed SOAP clinical notes, cross-specialist referrals and a rules-based scheduling agent (no LLM). Built with Laravel, Vue 3, PostgreSQL with Row-Level Security and Redis.",
      },
    },
  },
  blog: {
    title: "Writing & Articles",
    subtitle: "Thoughts on software engineering, architecture and the web.",
    loading: "Loading articles...",
    error: "Articles could not be loaded. Please try again later.",
    empty: {
      title: "Coming soon",
      description: "I'm working on the blog. The first articles will arrive soon.",
    },
    readArticle: "Read article",
  },
  contact: {
    title: "Contact",
    subtitle: "Have a project in mind or a job opportunity? Let's talk.",
    name: "Name",
    email: "Email",
    message: "Message",
    placeholder: {
      name: "Your name",
      email: "you@email.com",
      message: "Describe your proposal here...",
    },
    submit: "Send Message",
    submitting: "Sending...",
    success: {
      title: "Message sent!",
      message: "I'll get back to you as soon as possible.",
    },
    errorSend: "The message could not be sent. Write to me directly at {{email}}.",
    notConfigured: "The contact form is not available yet. Write to me at",
    validation: {
      nameMin: "Name must be at least 2 characters long.",
      emailInvalid: "Must be a valid email.",
      messageMin: "Message must be at least 10 characters long.",
    },
  },
  errorBoundary: {
    title: "Something went wrong",
    message: "An unexpected error occurred. Try reloading the page.",
    reload: "Reload page",
  },
  meta: {
    home: {
      title: "Euclides Rafael Marin | Full Stack Developer",
      description:
        "Technical portfolio of Euclides Rafael Marin, Full Stack Developer specialized in React and Node.js.",
    },
    projects: {
      title: "Projects | Euclides Rafael Marin",
      description: "Projects and systems built by Euclides Rafael Marin.",
    },
    blog: {
      title: "Writing | Euclides Rafael Marin",
      description: "Articles on software engineering, architecture and web development.",
    },
    contact: {
      title: "Contact | Euclides Rafael Marin",
      description: "Get in touch with Euclides Rafael Marin for projects or opportunities.",
    },
  },
} satisfies TranslationSchema;

export default en;
