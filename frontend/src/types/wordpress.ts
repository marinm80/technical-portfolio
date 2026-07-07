/** Shape mínimo de un post devuelto por la WordPress REST API (wp/v2/posts). */
export interface WordPressPost {
  id: number;
  slug: string;
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
}
