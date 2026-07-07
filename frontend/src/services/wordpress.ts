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

function getBaseUrl(): string | undefined {
  const url = import.meta.env.VITE_WP_API_URL as string | undefined;
  return url ? url.replace(/\/+$/, "") : undefined;
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
