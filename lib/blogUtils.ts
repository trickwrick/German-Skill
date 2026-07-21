import type { BlogPost } from "./blogStore";

export const DEFAULT_BLOG_CATEGORIES = ["Learn German", "Goethe-Zertifikat Prep"];

export function getRecentBlogPosts(posts: BlogPost[], limit = 3, excludeSlug?: string) {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (!excludeSlug) {
    return sorted.slice(0, limit);
  }

  const otherPosts = sorted.filter((post) => post.slug !== excludeSlug);
  if (otherPosts.length > 0) {
    return otherPosts.slice(0, limit);
  }

  return sorted.slice(0, limit);
}

export function getSidebarBlogPosts(posts: BlogPost[], currentSlug?: string) {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (currentSlug) {
    return getRecentBlogPosts(sorted, 3, currentSlug);
  }

  return sorted;
}

export function getBlogCategories(posts: BlogPost[]) {
  const categories = new Set<string>(DEFAULT_BLOG_CATEGORIES);

  for (const post of posts) {
    for (const category of post.categories ?? []) {
      const trimmed = category.trim();
      if (trimmed) {
        categories.add(trimmed);
      }
    }
  }

  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

export function filterBlogPostsByCategory(posts: BlogPost[], category?: string) {
  const normalized = category?.trim();
  if (!normalized) {
    return posts;
  }

  return posts.filter((post) =>
    (post.categories ?? []).some(
      (item) => item.trim().toLowerCase() === normalized.toLowerCase(),
    ),
  );
}
