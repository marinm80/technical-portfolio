import type { Project } from "../types";
import { profile } from "./profile";

// Las descripciones viven en src/locales/{es,en}.ts bajo projects.items.<id>.
export const projects: Project[] = [
  {
    id: "taskManager",
    title: "Task Manager API",
    tags: ["Node.js", "Express", "JWT", "Docker"],
    github: "https://github.com/marinm80/task-manager-jwt",
    live: "https://task.rafaelmarin.dev",
  },
  {
    id: "portfolio",
    title: "Technical Portfolio",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    github: "https://github.com/marinm80/technical-portfolio",
    live: profile.domain,
  },
  {
    id: "omDistribution",
    title: "OM Distribution",
    tags: ["TypeScript", "MySQL", "Docker"],
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
