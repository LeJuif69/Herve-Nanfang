interface SchemaJsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>
}

/**
 * Composant d'injection sécurisée de données structurées JSON-LD
 */
export default function SchemaJsonLd({ data }: SchemaJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
