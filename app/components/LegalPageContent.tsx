type LegalPageContentProps = {
  paragraphs: string[];
};

export default function LegalPageContent({ paragraphs }: LegalPageContentProps) {
  return (
    <section className="legal-page">
      <div className="legal-page-inner">
        {paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
