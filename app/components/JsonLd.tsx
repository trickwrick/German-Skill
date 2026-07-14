type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown> | null>;
};

export default function JsonLd({ data }: JsonLdProps) {
  const items = (Array.isArray(data) ? data : [data]).filter(
    (item): item is Record<string, unknown> => Boolean(item),
  );

  return (
    <>
      {items.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
