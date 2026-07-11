import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export const PUBLIC_REVALIDATE_SECONDS = 300;

export const CACHE_TAGS = {
  blogPosts: "blog-posts",
  blogPost: (slug: string) => `blog-post:${slug}`,
  courses: "courses",
  course: (slug: string) => `course:${slug}`,
  seoSettings: "seo-settings",
  videoTestimonials: "video-testimonials",
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
  revalidatePath("/blog");

  for (const slug of slugs) {
    const trimmed = slug.trim();
    if (trimmed) {
      revalidateTag(CACHE_TAGS.blogPost(trimmed));
      revalidatePath(`/blog/${trimmed}`);
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

export function revalidatePublicSeoData() {
  revalidateTag(CACHE_TAGS.seoSettings);
}

function safeRevalidate(run: () => void) {
  try {
    run();
  } catch (error) {
    console.error("Cache revalidation failed", error);
  }
}

export function safeRevalidatePublicBlogData(...slugs: string[]) {
  safeRevalidate(() => revalidatePublicBlogData(...slugs));
}

export function safeRevalidatePublicCourseData(...slugs: string[]) {
  safeRevalidate(() => revalidatePublicCourseData(...slugs));
}

export function safeRevalidatePublicSeoData() {
  safeRevalidate(() => revalidatePublicSeoData());
}
