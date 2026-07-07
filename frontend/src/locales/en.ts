import type es from "./es";

// `satisfies` garantiza en compile-time la paridad de keys con es.ts.
type TranslationSchema = typeof es;

const en = {
  nav: {
    overview: "Overview",
    experience: "Experience",
    projects: "Projects",
    blog: "Writing",
    contact: "Contact",
  },
  sidebar: {
    themeLight: "Light mode",
    themeDark: "Dark mode",
  },
  home: {
    title: "Software Engineer",
    subtitle: "specialized in React & Node.js",
    bio: "I transform complex problems into scalable and efficient systems. Focused on code quality, clean architectures, and exceptional user experiences.",
    viewExp: "View Experience",
    viewProjects: "View Projects",
    linkedin: "LinkedIn",
    stack: "Main Stack",
  },
  experience: {
    title: "Experience",
    subtitle: "An overview of my professional journey and technical achievements.",
    showMore: "Show more",
    showLess: "Show less",
    // TODO(rafael): placeholder content — replace with real work experience.
    items: {
      techcorp: {
        role: "Senior Frontend Engineer",
        company: "Tech Corp",
        period: "2021 — Present",
        bullets: [
          "Led the migration from a monolithic architecture to micro-frontends, reducing build time by 40%.",
          "Implemented a design system with React and Tailwind CSS, standardizing components across 5 teams.",
          "Optimized Core Web Vitals reaching a 95+ Lighthouse score through advanced lazy loading and SSR.",
          "Mentored new engineers during onboarding, reducing ramp-up time by 30%.",
          "Established strict code review guidelines ensuring long-term maintainability.",
        ],
      },
      startup: {
        role: "Fullstack Developer",
        company: "Startup Inc",
        period: "2018 — 2021",
        bullets: [
          "Built RESTful APIs in Node.js and Express handling over 1M daily requests.",
          "Designed relational database schemas in PostgreSQL for complex billing systems.",
          "Integrated third-party payment gateways (Stripe, PayPal) ensuring PCI-DSS compliance.",
          "Deployed scalable infrastructure using AWS ECS and classic load balancers.",
        ],
      },
    },
  },
  projects: {
    title: "Featured Projects",
    subtitle: "A selection of systems and applications I have built.",
    sourceLabel: "Source code",
    demoLabel: "Live demo",
    items: {
      taskManager: {
        description:
          "Task management REST API with JWT authentication, rate limiting, health endpoint and password recovery. Deployed with Docker behind Nginx Proxy Manager.",
      },
      portfolio: {
        description:
          "This very site: a React 19 SPA with strict TypeScript, Tailwind CSS 4, i18n (es/en), Vitest tests and GitHub Actions CI/CD to a VPS.",
      },
      omDistribution: {
        description:
          "Web platform for a food distribution company in the US: landing page and internal management built on TypeScript and PostgreSQL, containerized with Docker.",
      },
      composeFeatures: {
        description:
          "Self-hosted infrastructure stack with Docker Compose: nginx-proxy, Portainer, Uptime Kuma and Watchtower for management, monitoring and automated deployments.",
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
      title: "Rafael Marin | Software Engineer",
      description:
        "Technical portfolio of Rafael Marin, Software Engineer specialized in React and Node.js.",
    },
    experience: {
      title: "Experience | Rafael Marin",
      description: "Professional journey and technical achievements of Rafael Marin.",
    },
    projects: {
      title: "Projects | Rafael Marin",
      description: "Projects and systems built by Rafael Marin.",
    },
    blog: {
      title: "Writing | Rafael Marin",
      description: "Articles on software engineering, architecture and web development.",
    },
    contact: {
      title: "Contact | Rafael Marin",
      description: "Get in touch with Rafael Marin for projects or opportunities.",
    },
  },
} satisfies TranslationSchema;

export default en;
