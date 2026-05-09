import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Understanding React Server Components",
    date: "May 15, 2026",
    readingTime: "5 min read",
    summary: "A deep dive into how Server Components change the rendering paradigm in modern React applications and how to leverage them for performance.",
    content: [
      "Los React Server Components (RSC) representan un cambio fundamental en cómo pensamos sobre la hidratación de las aplicaciones.",
      "A diferencia de los componentes tradicionales que envían JavaScript al cliente para ser ejecutado, los RSC se renderizan exclusivamente en el servidor y envían HTML y UI precomputada. Esto significa cero impacto en el bundle de JavaScript del usuario.",
      "Aprender a diferenciar entre un 'Server Component' y un 'Client Component' (mediante 'use client') es esencial para optimizar el rendimiento sin perder la interactividad donde realmente importa."
    ]
  },
  {
    id: 2,
    title: "Defensive Programming in TypeScript",
    date: "April 02, 2026",
    readingTime: "8 min read",
    summary: "Why avoiding 'any' isn't enough. How to use Zod for runtime validation and type guards to build resilient frontends.",
    content: [
      "TypeScript es increíble para el tiempo de desarrollo, pero una vez que el código se compila a JavaScript y se ejecuta en el navegador, todas las interfaces desaparecen. Si dependes de una API externa, no tienes garantías reales.",
      "Aquí es donde entra Zod. Al definir esquemas de validación, puedes interceptar respuestas de red y validarlas en tiempo de ejecución. Si la API cambia su contrato silenciosamente, tu frontend lanzará un error controlado en lugar de colapsar con el clásico 'undefined is not a function'.",
      "Adoptar programación defensiva significa no confiar ciegamente en los datos que no controlas directamente."
    ]
  },
  {
    id: 3,
    title: "Micro-frontends with Module Federation",
    date: "January 20, 2026",
    readingTime: "12 min read",
    summary: "Scaling large React applications across multiple autonomous teams without losing the Single Page Application feel.",
    content: [
      "A medida que las organizaciones de ingeniería crecen, mantener un monolito de frontend se vuelve insostenible. Los tiempos de build aumentan exponencialmente y los conflictos de ramas son diarios.",
      "Webpack Module Federation permite dividir un monolito en múltiples micro-frontends que se cargan dinámicamente en tiempo de ejecución. Un equipo puede desplegar su sección del producto sin necesidad de que los demás compilen nada.",
      "El principal desafío arquitectónico no es técnico, sino organizacional: decidir cómo compartir el estado global y mantener una consistencia visual unificada (Design System)."
    ]
  }
];

function ArticleCard({ article, index }: { article: typeof articles[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`group block p-6 -mx-6 rounded-2xl transition-colors border border-transparent ${isExpanded ? 'bg-obsidian border-obsidian-border shadow-lg' : 'hover:bg-obsidian-light'}`}
    >
      <div 
        className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-slate-100 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        <div className="text-xs font-mono text-slate-500 mt-2 sm:mt-0 whitespace-nowrap">
          {article.date} · {article.readingTime}
        </div>
      </div>
      
      <p className="text-slate-400 text-sm leading-relaxed mb-2">
        {article.summary}
      </p>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-obsidian-border space-y-4">
              {article.content.map((paragraph, i) => (
                <p key={i} className="text-slate-300 text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center gap-1.5 mt-4 text-xs font-medium text-accent hover:text-white transition-colors"
      >
        {isExpanded ? (
          <>Cerrar artículo <ChevronUp className="w-3.5 h-3.5" /></>
        ) : (
          <>Leer artículo <ChevronDown className="w-3.5 h-3.5" /></>
        )}
      </button>
    </motion.article>
  );
}

export default function Blog() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Escritos & Artículos</h1>
        <p className="text-slate-400">Pensamientos sobre ingeniería de software, arquitectura y la web.</p>
      </div>

      <div className="space-y-4">
        {articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
