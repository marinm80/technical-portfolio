import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GithubIcon } from "../components/icons/GithubIcon";
import Seo from "../components/Seo";
import { projects } from "../data/projects";

export default function Projects() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <Seo title={t('meta.projects.title')} description={t('meta.projects.description')} />

      <div>
        <h1 className="text-3xl font-bold mb-2">{t('projects.title')}</h1>
        <p className="text-content-muted">{t('projects.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="flex flex-col bg-surface-alt border border-edge p-6 rounded-xl transition-colors hover:border-content-muted/40">
            <h3 className="font-semibold text-lg text-content-strong mb-4">{project.title}</h3>

            <p className="text-content-muted text-sm mb-6 flex-1">
              {t(`projects.items.${project.id}.description`)}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-auto">
              {(project.live ?? project.github) && (
                <a
                  href={project.live ?? project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium bg-accent text-surface px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  {t('projects.viewProject')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium border border-edge px-4 py-2 rounded-lg text-content-strong hover:border-accent hover:text-accent transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
