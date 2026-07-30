export const MAX_BLOG_PDF_SIZE_MB = 4;

export function validateBlogPdfFile(file: Pick<File, "name" | "type" | "size">) {
  const lowerName = file.name.trim().toLowerCase();
  const isPdf =
    file.type === "application/pdf" ||
    file.type === "application/x-pdf" ||
    lowerName.endsWith(".pdf");

  if (!isPdf) {
    return {
      ok: false as const,
      error: "Please upload a PDF file.",
    };
  }

  if (file.size > MAX_BLOG_PDF_SIZE_MB * 1024 * 1024) {
    return {
      ok: false as const,
      error: `PDF must be ${MAX_BLOG_PDF_SIZE_MB}MB or smaller.`,
    };
  }

  return { ok: true as const };
}
