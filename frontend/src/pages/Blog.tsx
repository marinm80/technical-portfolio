import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ImageOff, Loader2, PenLine, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import { getFeaturedImage, getLatestPosts, isBlogConfigured } from "../services/wordpress";
import type { WordPressPost } from "../types/wordpress";

type BlogStatus = "loading" | "success" | "error" | "empty";

/** WP devuelve title/excerpt como HTML; extraemos solo el texto plano. */
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").trim();
}

function formatDate(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

function PostCard({ post, index, locale }: { post: WordPressPost; index: number; locale: string }) {
  const { t } = useTranslation();
  const image = getFeaturedImage(post);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group flex flex-col bg-surface-alt border border-edge rounded-xl overflow-hidden transition-all hover:border-content-muted/40 hover:shadow-lg"
    >
      <a
        href={post.link}
        target="_blank"
        rel="noreferrer"
        aria-label={image ? undefined : stripHtml(post.title.rendered)}
        className="block aspect-video bg-accent/10 overflow-hidden"
      >
        {image ? (
          <img
            src={image.url}
            alt={image.alt || stripHtml(post.title.rendered)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-accent/50">
            <ImageOff className="w-8 h-8" />
          </span>
        )}
      </a>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wide text-accent bg-accent/10 px-2 py-1 rounded">
            {t('nav.projects')}
          </span>
          <span className="text-xs font-mono text-content-muted whitespace-nowrap">
            {formatDate(post.date, locale)}
          </span>
        </div>

        <h2 className="text-lg font-semibold text-content-strong group-hover:text-accent transition-colors mb-2">
          {stripHtml(post.title.rendered)}
        </h2>

        <p className="text-content-muted text-sm leading-relaxed flex-1">
          {stripHtml(post.excerpt.rendered)}
        </p>

        <a
          href={post.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-accent hover:text-content-strong transition-colors"
        >
          {t('blog.readArticle')} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<BlogStatus>(isBlogConfigured() ? "loading" : "empty");
  const [posts, setPosts] = useState<WordPressPost[]>([]);

  useEffect(() => {
    if (!isBlogConfigured()) return;

    let cancelled = false;
    getLatestPosts(10)
      .then((result) => {
        if (cancelled) return;
        setPosts(result);
        setStatus(result.length > 0 ? "success" : "empty");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <Seo title={t('meta.blog.title')} description={t('meta.blog.description')} canonicalPath="/blog" />

      <div>
        <h1 className="text-3xl font-bold mb-2">{t('blog.title')}</h1>
        <p className="text-content-muted">{t('blog.subtitle')}</p>
      </div>

      {status === "loading" && (
        <div className="flex items-center gap-3 text-content-muted py-12" role="status">
          <Loader2 className="w-5 h-5 animate-spin" />
          {t('blog.loading')}
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 text-content-muted py-12">
          <TriangleAlert className="w-5 h-5 text-red-400 shrink-0" />
          {t('blog.error')}
        </div>
      )}

      {status === "empty" && (
        <div className="flex flex-col items-center justify-center text-center py-16 space-y-4 border border-dashed border-edge rounded-2xl">
          <PenLine className="w-10 h-10 text-content-muted" />
          <h2 className="text-xl font-semibold">{t('blog.empty.title')}</h2>
          <p className="text-content-muted max-w-sm">{t('blog.empty.description')}</p>
        </div>
      )}

      {status === "success" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} locale={i18n.language} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
