import { motion } from "framer-motion";

const experiences = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "Tech Corp",
    period: "2021 — Presente",
    description: [
      "Lideré la migración de una arquitectura monolítica a micro-frontends reduciendo el tiempo de build en un 40%.",
      "Implementé un sistema de diseño utilizando React y Tailwind CSS, estandarizando componentes para 5 equipos.",
      "Optimicé el Core Web Vitals alcanzando un score de 95+ en Lighthouse a través de lazy loading avanzado y SSR."
    ]
  },
  {
    id: 2,
    role: "Fullstack Developer",
    company: "Startup Inc",
    period: "2018 — 2021",
    description: [
      "Desarrollé APIs RESTful en Node.js y Express gestionando más de 1M de peticiones diarias.",
      "Diseñé esquemas de bases de datos relacionales en PostgreSQL para sistemas de facturación complejos.",
      "Mentoricé a 3 desarrolladores junior en buenas prácticas y TypeScript estricto."
    ]
  }
];

export default function Experience() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Experiencia</h1>
        <p className="text-slate-400">Un resumen de mi trayectoria profesional y logros técnicos.</p>
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-obsidian-border before:to-transparent">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Timeline marker */}
            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-accent bg-obsidian text-accent shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2" />
            
            <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] pl-4 md:pl-0">
              <div className="flex flex-col bg-obsidian-light border border-obsidian-border p-6 rounded-xl shadow-lg transition-colors hover:border-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-lg text-slate-100">{exp.role}</h3>
                  <span className="text-xs font-mono text-slate-500 bg-obsidian px-2 py-1 rounded">{exp.period}</span>
                </div>
                <div className="text-accent font-medium text-sm mb-4">{exp.company}</div>
                <ul className="space-y-2 text-slate-400 text-sm">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent mt-1 opacity-50">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
