function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function legalParagraphsToHtml(paragraphs: string[]) {
  return paragraphs
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

export function getLegalPageHtml(content?: { html?: string; paragraphs?: string[] }, fallbackHtml = "") {
  if (typeof content?.html === "string" && content.html.trim()) {
    return content.html.trim();
  }

  if (Array.isArray(content?.paragraphs) && content.paragraphs.length) {
    return legalParagraphsToHtml(content.paragraphs);
  }

  return fallbackHtml;
}
