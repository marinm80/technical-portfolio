import { motion } from "framer-motion";

const articles = [
  {
    id: 1,
    title: "Understanding React Server Components",
    date: "May 15, 2026",
    readingTime: "5 min read",
    summary: "A deep dive into how Server Components change the rendering paradigm in modern React applications and how to leverage them for performance."
  },
  {
    id: 2,
    title: "Defensive Programming in TypeScript",
    date: "April 02, 2026",
    readingTime: "8 min read",
    summary: "Why avoiding 'any' isn't enough. How to use Zod for runtime validation and type guards to build resilient frontends."
  },
  {
    id: 3,
    title: "Micro-frontends with Module Federation",
    date: "January 20, 2026",
    readingTime: "12 min read",
    summary: "Scaling large React applications across multiple autonomous teams without losing the Single Page Application feel."
  }
];

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

      <div className="space-y-6">
        {articles.map((article, i) => (
          <motion.article 
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="group cursor-pointer block p-6 -mx-6 rounded-2xl hover:bg-obsidian-light transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
              <h3 className="text-lg font-semibold text-slate-100 group-hover:text-accent transition-colors">
                {article.title}
              </h3>
              <div className="text-xs font-mono text-slate-500 mt-2 sm:mt-0 whitespace-nowrap">
                {article.date} · {article.readingTime}
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {article.summary}
            </p>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
