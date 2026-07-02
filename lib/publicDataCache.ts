import { revalidateTag, unstable_cache } from "next/cache";

export const PUBLIC_REVALIDATE_SECONDS = 60;

export const CACHE_TAGS = {
  blogPosts: "blog-posts",
  blogPost: (slug: string) => `blog-post:${slug}`,
  courses: "courses",
  course: (slug: string) => `course:${slug}`,
} as const;

export type PublicDataOptions = {
  fresh?: boolean;
};

export function getCachedPublicData<T>(
  key: string[],
  tags: string[],
  loader: () => Promise<T>,
): Promise<T> {
  return unstable_cache(loader, key, {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags,
  })();
}

export function revalidatePublicBlogData(...slugs: string[]) {
  revalidateTag(CACHE_TAGS.blogPosts);

  for (const slug of slugs) {
    if (slug.trim()) {
      revalidateTag(CACHE_TAGS.blogPost(slug.trim()));
    }
  }
}

export function revalidatePublicCourseData(...slugs: string[]) {
  revalidateTag(CACHE_TAGS.courses);

  for (const slug of slugs) {
    if (slug.trim()) {
      revalidateTag(CACHE_TAGS.course(slug.trim()));
    }
  }
}
