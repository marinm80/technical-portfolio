import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Ingeniero de Software <br className="hidden md:block" />
          <span className="text-slate-400">especializado en React & Node.js</span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
          Transformo problemas complejos en sistemas escalables y eficientes. 
          Enfocado en la calidad del código, arquitecturas limpias y experiencias de usuario excepcionales.
        </p>
        
        <div className="flex items-center gap-4 pt-4">
          <Link
            to="/experience"
            className="inline-flex items-center gap-2 bg-slate-100 text-obsidian px-5 py-2.5 rounded-lg font-medium hover:bg-white transition-colors"
          >
            Ver Experiencia
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white transition-colors"
          >
            Descargar CV
          </a>
        </div>
      </section>

      <section className="space-y-6 pt-8 border-t border-obsidian-border">
        <h2 className="text-2xl font-semibold">Stack Principal</h2>
        <div className="flex flex-wrap gap-3">
          {["TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", "PostgreSQL", "AWS"].map((tech) => (
            <span key={tech} className="px-3 py-1.5 bg-obsidian-light border border-obsidian-border rounded-md text-sm font-mono text-slate-300">
              {tech}
            </span>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
