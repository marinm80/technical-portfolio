import * as z from "zod";
import type { WordPressPost } from "../types/wordpress";

const wpPostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  link: z.string(),
  date: z.string(),
  title: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }),
});

const wpPostsSchema = z.array(wpPostSchema);

const wpTagSchema = z.object({ id: z.number(), slug: z.string() });
const wpTagsSchema = z.array(wpTagSchema);

const wpPostWithTagsSchema = wpPostSchema.extend({ tags: z.array(z.number()) });
const wpPostsWithTagsSchema = z.array(wpPostWithTagsSchema);

// URL pública del blog propio; VITE_WP_API_URL la sobreescribe (p. ej. en dev).
const DEFAULT_WP_URL = "https://blog.rafaelmarin.dev";

function getBaseUrl(): string | undefined {
  const url = (import.meta.env.VITE_WP_API_URL as string | undefined) || DEFAULT_WP_URL;
  return url.replace(/\/+$/, "");
}

export function isBlogConfigured(): boolean {
  return Boolean(getBaseUrl());
}

export async function getLatestPosts(limit = 10): Promise<WordPressPost[]> {
  const base = getBaseUrl();
  if (!base) {
    throw new Error("VITE_WP_API_URL is not configured");
  }

  const url = `${base}/wp-json/wp/v2/posts?per_page=${limit}&_fields=id,slug,link,date,title,excerpt`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WordPress API responded with ${response.status}`);
  }

  // Validación en runtime: si WP cambia su contrato, fallamos de forma controlada.
  return wpPostsSchema.parse(await response.json());
}

/**
 * Posts del blog asociados a cada proyecto, cruzados vía tags de WordPress.
 * Los slugs de los tags en WP son el id del proyecto en minúsculas
 * (WP fuerza lowercase: "taskManager" -> "taskmanager").
 * Devuelve un mapa projectId -> posts (vacío para proyectos sin artículos).
 */
export async function getProjectPosts(
  projectIds: string[],
  limitPerProject = 3,
): Promise<Record<string, WordPressPost[]>> {
  const base = getBaseUrl();
  if (!base) {
    throw new Error("VITE_WP_API_URL is not configured");
  }

  const bySlug = new Map(projectIds.map((id) => [id.toLowerCase(), id]));

  const tagsUrl = `${base}/wp-json/wp/v2/tags?slug=${[...bySlug.keys()].join(",")}&_fields=id,slug`;
  const tagsResponse = await fetch(tagsUrl);
  if (!tagsResponse.ok) {
    throw new Error(`WordPress API responded with ${tagsResponse.status}`);
  }
  const tags = wpTagsSchema.parse(await tagsResponse.json());

  const result: Record<string, WordPressPost[]> = Object.fromEntries(
    projectIds.map((id) => [id, []]),
  );
  if (tags.length === 0) return result;

  const postsUrl = `${base}/wp-json/wp/v2/posts?tags=${tags.map((t) => t.id).join(",")}&per_page=100&_fields=id,slug,link,date,title,excerpt,tags`;
  const postsResponse = await fetch(postsUrl);
  if (!postsResponse.ok) {
    throw new Error(`WordPress API responded with ${postsResponse.status}`);
  }
  const posts = wpPostsWithTagsSchema.parse(await postsResponse.json());

  for (const tag of tags) {
    const projectId = bySlug.get(tag.slug);
    if (!projectId) continue;
    result[projectId] = posts
      .filter((post) => post.tags.includes(tag.id))
      .slice(0, limitPerProject);
  }
  return result;
}
