import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import { experiences } from "../data/experience";
import type { Experience as ExperienceItem } from "../types";

function ExperienceCard({ exp }: { exp: ExperienceItem }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const bullets = t(`experience.items.${exp.id}.bullets`, { returnObjects: true }) as string[];

  // Decidimos mostrar los 2 primeros elementos por defecto.
  const visibleItems = isExpanded ? bullets : bullets.slice(0, 2);
  const hasMore = bullets.length > 2;

  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      {/* Timeline marker */}
      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-accent bg-surface text-accent shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2" />

      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] pl-4 md:pl-0">
        <div className="flex flex-col bg-surface-alt border border-edge p-6 rounded-xl shadow-lg transition-colors hover:border-content-muted/40">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-lg text-content-strong">{t(`experience.items.${exp.id}.role`)}</h3>
            <span className="text-xs font-mono text-content-muted bg-surface px-2 py-1 rounded whitespace-nowrap ml-2">{t(`experience.items.${exp.id}.period`)}</span>
          </div>
          <div className="text-accent font-medium text-sm mb-4">{t(`experience.items.${exp.id}.company`)}</div>

          <ul className="space-y-2 text-content-muted text-sm">
            <AnimatePresence initial={false}>
              {visibleItems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2"
                >
                  <span className="text-accent mt-1 opacity-50 shrink-0">▹</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 mt-4 text-xs font-medium text-content-muted hover:text-accent transition-colors w-fit"
            >
              {isExpanded ? (
                <>{t('experience.showLess')} <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>{t('experience.showMore')} <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <Seo title={t('meta.experience.title')} description={t('meta.experience.description')} canonicalPath="/experience" />

      <div>
        <h1 className="text-3xl font-bold mb-2">{t('experience.title')}</h1>
        <p className="text-content-muted">{t('experience.subtitle')}</p>
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-edge before:to-transparent">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} exp={exp} />
        ))}
      </div>
    </motion.div>
  );
}
