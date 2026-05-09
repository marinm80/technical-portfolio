import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "../components/icons/GithubIcon";

const projects = [
  {
    id: 1,
    title: "E-commerce Microservices",
    description: "Plataforma de comercio electrónico con arquitectura de microservicios usando Node.js, RabbitMQ y Docker. Soporta picos de 10k usuarios concurrentes.",
    tags: ["Node.js", "Docker", "RabbitMQ", "Redis"],
    github: "#",
    live: "#"
  },
  {
    id: 2,
    title: "Analytics Dashboard",
    description: "Panel de control en tiempo real para visualización de datos de ventas. Construido con React, Tailwind CSS y WebSockets para actualizaciones en vivo.",
    tags: ["React", "TypeScript", "Tailwind", "WebSockets"],
    github: "#",
    live: "#"
  },
  {
    id: 3,
    title: "Auth Gateway",
    description: "Servicio de autenticación centralizado (SSO) implementando OAuth2 y JWT, con rate limiting y prevención de ataques de fuerza bruta.",
    tags: ["Express", "JWT", "PostgreSQL", "OAuth2"],
    github: "#",
    live: "#"
  }
];

export default function Projects() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Proyectos Destacados</h1>
        <p className="text-slate-400">Una selección de sistemas y aplicaciones que he construido.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="flex flex-col bg-obsidian-light border border-obsidian-border p-6 rounded-xl transition-colors hover:border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-slate-100">{project.title}</h3>
              <div className="flex gap-2">
                <a href={project.github} className="text-slate-400 hover:text-white transition-colors" aria-label="Código fuente">
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a href={project.live} className="text-slate-400 hover:text-white transition-colors" aria-label="Demo en vivo">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm mb-6 flex-1">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
