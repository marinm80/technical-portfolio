interface SeoProps {
  title: string;
  description: string;
}

/**
 * React 19 hace hoisting automático de <title> y <meta> al <head>,
 * por lo que no se necesita ninguna librería tipo react-helmet.
 */
export default function Seo({ title, description }: SeoProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  );
}
