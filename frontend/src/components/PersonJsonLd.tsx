import { profile } from "../data/profile";

/**
 * Structured data (schema.org/Person) para que los buscadores puedan asociar
 * el sitio con la persona (habilita rich results / knowledge panel).
 * No requiere hoisting: Google acepta JSON-LD en cualquier parte del DOM.
 */
export default function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: profile.domain,
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
