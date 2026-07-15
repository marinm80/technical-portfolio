import type { Project } from "../types";

// Las descripciones viven en src/locales/{es,en}.ts bajo projects.items.<id>.
// Los proyectos PERN (Taskly, SG-Remesas, OM Distribution) comparten un set
// de tags estándar: React, Node.js, Express, la base de datos, Docker.
export const projects: Project[] = [
  {
    id: "taskManager",
    title: "Taskly",
    tags: ["React", "Node.js", "Express", "PostgreSQL", "Docker"],
    github: "https://github.com/marinm80/task-manager-jwt",
    live: "https://taskly.rafaelmarin.dev",
  },
  {
    id: "omDistribution",
    title: "OM Distribution",
    tags: ["React", "Node.js", "Express", "MySQL", "Docker"],
    github: "https://github.com/marinm80/om_distribution",
    live: "https://omdistribution.rafaelmarin.dev/",
  },
  {
    id: "SG_Remesas",
    title: "SG-Remesas",
    tags: ["React", "Node.js", "Express", "PostgreSQL", "Docker"],
    github: "https://github.com/marinm80/sg-remesas",
    live: "https://sg-remesas.rafaelmarin.dev/",
  },
];
