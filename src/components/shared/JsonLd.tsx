import type { JsonLdSchema } from "@/utils/jsonLd";

/**
 * Renders one or many JSON-LD blocks. Safe to use in server components.
 * Each schema gets its own <script> for clean Google parsing.
 */
export function JsonLd({ data }: { data: JsonLdSchema | JsonLdSchema[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
