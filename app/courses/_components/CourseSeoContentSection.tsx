import { sanitizeBlogHtml } from "../../../lib/blogHtmlUtils";

type CourseSeoContentSectionProps = {
  html: string;
  title?: string;
};

export default function CourseSeoContentSection({
  html,
  title = "About This Course",
}: CourseSeoContentSectionProps) {
  const content = html.trim();
  if (!content) {
    return null;
  }

  return (
    <section className="course-seo-content-section" aria-labelledby="course-seo-content-heading">
      <div className="course-seo-content-inner">
        <h2 id="course-seo-content-heading" className="course-seo-content-title">
          {title}
        </h2>
        <div
          className="course-seo-content-body"
          dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(content) }}
        />
      </div>
    </section>
  );
}
