import { applyCityPlaceholder } from "../../lib/cityRichHtml";

type RichHtmlContentProps = {
  html: string;
  className?: string;
  cityName?: string;
};

export default function RichHtmlContent({
  html,
  className = "",
  cityName,
}: RichHtmlContentProps) {
  const content = applyCityPlaceholder(html?.trim() ?? "", cityName ?? "");
  if (!content) {
    return null;
  }

  return (
    <div
      className={`city-rich-html${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
