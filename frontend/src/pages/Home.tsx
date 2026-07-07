import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LinkedinIcon } from "../components/icons/LinkedinIcon";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import { profile } from "../data/profile";

export default function Home() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <Seo title={t('meta.home.title')} description={t('meta.home.description')} />

      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          {t('home.title')} <br className="hidden md:block" />
          <span className="text-content-muted">{t('home.subtitle')}</span>
        </h1>
        <p className="text-lg text-content-muted leading-relaxed max-w-2xl">
          {t('home.bio')}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link
            to="/experience"
            className="inline-flex items-center gap-2 bg-content-strong text-surface px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {t('home.viewExp')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-content hover:text-accent transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
            {t('home.linkedin')}
          </a>
        </div>
      </section>

      <section className="space-y-6 pt-8 border-t border-edge">
        <h2 className="text-2xl font-semibold">{t('home.stack')}</h2>
        <div className="flex flex-wrap gap-3">
          {profile.stack.map((tech) => (
            <span key={tech} className="px-3 py-1.5 bg-surface-alt border border-edge rounded-md text-sm font-mono text-content">
              {tech}
            </span>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
