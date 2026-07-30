export const MAX_BLOG_IMAGE_SIZE_MB = 4;

const acceptedImageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function getBlogImageExtension(file: Pick<File, "name" | "type">) {
  const fromType = acceptedImageTypes[file.type];
  if (fromType) {
    return fromType;
  }

  const lowerName = file.name.trim().toLowerCase();
  if (lowerName.endsWith(".jpeg") || lowerName.endsWith(".jpg")) return "jpg";
  if (lowerName.endsWith(".png")) return "png";
  if (lowerName.endsWith(".webp")) return "webp";
  if (lowerName.endsWith(".gif")) return "gif";

  return null;
}

export function validateBlogImageFile(file: Pick<File, "name" | "type" | "size">) {
  const extension = getBlogImageExtension(file);
  if (!extension) {
    return {
      ok: false as const,
      error: "Please upload a JPG, PNG, WEBP, or GIF image.",
    };
  }

  if (file.size > MAX_BLOG_IMAGE_SIZE_MB * 1024 * 1024) {
    return {
      ok: false as const,
      error: `Image must be ${MAX_BLOG_IMAGE_SIZE_MB}MB or smaller.`,
    };
  }

  return { ok: true as const, extension };
}
