type LegalPageContentProps = {
  paragraphs: string[];
};

export default function LegalPageContent({ paragraphs }: LegalPageContentProps) {
  return (
    <section className="legal-page">
      <div className="legal-page-inner">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
