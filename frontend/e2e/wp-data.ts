export const WP_ORIGIN = "https://wp.characterization.test";

export const PORTFOLIO_CATEGORY_ID = 3;
export const TASK_MANAGER_TAG_ID = 11;

export const COVER_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

export const blogPosts = [
  {
    id: 101,
    slug: "arquitectura-por-capas",
    link: `${WP_ORIGIN}/arquitectura-por-capas/`,
    date: "2026-10-01T09:00:00",
    title: { rendered: "Arquitectura por capas en React" },
    excerpt: { rendered: "<p>Separar UI, servicios y datos en una SPA.</p>" },
    _embedded: {
      "wp:featuredmedia": [{ source_url: `${WP_ORIGIN}/media/cover.png`, alt_text: "Diagrama de capas" }],
    },
  },
  {
    id: 102,
    slug: "despliegue-en-coolify",
    link: `${WP_ORIGIN}/despliegue-en-coolify/`,
    date: "2026-09-15T09:00:00",
    title: { rendered: "Despliegue de una SPA en Coolify &amp; Docker" },
    excerpt: { rendered: "<p>Imagen multi-stage con nginx.</p>" },
  },
];

export const projectTags = [{ id: TASK_MANAGER_TAG_ID, slug: "taskmanager" }];

export const projectPosts = [
  {
    id: 201,
    slug: "task-manager-diseno",
    link: `${WP_ORIGIN}/task-manager-diseno/`,
    date: "2026-08-20T09:00:00",
    title: { rendered: "Diseño del Task Manager" },
    excerpt: { rendered: "<p>Decisiones de diseño.</p>" },
    tags: [TASK_MANAGER_TAG_ID],
  },
];
