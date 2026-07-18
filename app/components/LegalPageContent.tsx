import { sanitizeBlogHtml } from "../../lib/blogHtmlUtils";

type LegalPageContentProps = {
  html: string;
};

export default function LegalPageContent({ html }: LegalPageContentProps) {
  const content = html.trim();
  if (!content) {
    return null;
  }

  return (
    <section className="legal-page">
      <div
        className="legal-page-inner blog-prose"
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(content) }}
      />
    </section>
  );
}
