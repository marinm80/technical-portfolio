import { profile } from "../data/profile";

interface SeoProps {
  title: string;
  description: string;
  /** Ruta de la página (ej. "/projects") para construir el canonical absoluto. */
  canonicalPath: string;
}

/**
 * React 19 hace hoisting automático de <title>, <meta> y <link> al <head>,
 * por lo que no se necesita ninguna librería tipo react-helmet.
 */
export default function Seo({ title, description, canonicalPath }: SeoProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${profile.domain}${canonicalPath}`} />
    </>
  );
}
