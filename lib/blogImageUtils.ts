export const DEFAULT_BLOG_IMAGE = "/portal-education.jpg";

export function resolveBlogImageSrc(image?: string | null) {
  const value = image?.trim();
  if (!value) {
    return DEFAULT_BLOG_IMAGE;
  }

  return value;
}

export function isUploadedBlogImage(src: string) {
  return src.startsWith("/api/blog-images/") || src.startsWith("/blogs/");
}

export function shouldUseUnoptimizedBlogImage(src: string) {
  return (
    isUploadedBlogImage(src) ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  );
}
