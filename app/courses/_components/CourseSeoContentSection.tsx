import { sanitizeBlogHtml } from "../../../lib/blogHtmlUtils";

type CourseSeoContentSectionProps = {
  html: string;
};

export default function CourseSeoContentSection({ html }: CourseSeoContentSectionProps) {
  const content = html.trim();
  if (!content) {
    return null;
  }

  return (
    <section className="course-seo-content-section" aria-label="Course information">
      <div className="course-seo-content-inner">
        <div
          className="course-seo-content-body"
          dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(content) }}
        />
      </div>
    </section>
  );
}
