/** Shape mínimo de un post devuelto por la WordPress REST API (wp/v2/posts). */
export interface WordPressPost {
  id: number;
  slug: string;
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  /** Presente solo cuando se pide con `_embed=wp:featuredmedia`. */
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text?: string }[];
  };
}
