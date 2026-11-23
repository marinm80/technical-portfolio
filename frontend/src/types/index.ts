export interface Project {
  /** i18n key segment: projects.items.<id>.description */
  id: string;
  title: string;
  tags: string[];
  github?: string;
  live?: string;
}

export type Theme = "light" | "dark";
