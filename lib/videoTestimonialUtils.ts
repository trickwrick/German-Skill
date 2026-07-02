export function getYoutubeVideoId(url: string): string | null {
  const value = url.trim();
  if (!value) {
    return null;
  }

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export function getYoutubeEmbedUrl(url: string) {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function formatTestimonialRating(rating: number) {
  const safe = Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 5;
  return safe.toFixed(1);
}

export function getDefaultTestimonialDescription(name: string) {
  const firstName = name.trim().split(/\s+/)[0] || "this student";
  return `Hear how ${firstName} improved their German skills with Fluent AUF live classes and exam-focused training.`;
}

export function getTestimonialDescription(item: { name: string; description?: string }) {
  const description = typeof item.description === "string" ? item.description.trim() : "";
  return description || getDefaultTestimonialDescription(item.name);
}

export function slugifyTestimonialId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
