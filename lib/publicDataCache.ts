import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { getCourseBySlug } from "../data/germanCourses";

export const PUBLIC_REVALIDATE_SECONDS = 300;

export const CACHE_TAGS = {
  blogPosts: "blog-posts",
  blogPost: (slug: string) => `blog-post:${slug}`,
  courses: "courses",
  course: (slug: string) => `course:${slug}`,
  seoSettings: "seo-settings",
  videoTestimonials: "video-testimonials",
  homeFaqs: "home-faqs",
  generalPages: "general-pages",
} as const;

export type PublicDataOptions = {
  fresh?: boolean;
};

/**
 * Public pages use ISR + unstable_cache. Admin reads pass `{ fresh: true }`.
 * After writes, call the matching safeRevalidatePublic* helpers so CDN/ISR update.
 */
export function shouldBypassPublicDataCache() {
  return false;
}

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
  revalidatePath("/blogs");

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
  revalidatePath("/");
  revalidatePath("/courses");

  for (const slug of slugs) {
    const trimmed = slug.trim();
    if (!trimmed) {
      continue;
    }

    revalidateTag(CACHE_TAGS.course(trimmed));
    const course = getCourseBySlug(trimmed);
    revalidatePath(`/course/${course?.pathName ?? trimmed}`);
  }
}

export function revalidatePublicVideoTestimonialsData() {
  revalidateTag(CACHE_TAGS.videoTestimonials);
  revalidatePath("/");
}

export function revalidatePublicHomeFaqsData() {
  revalidateTag(CACHE_TAGS.homeFaqs);
  revalidatePath("/");
}

export function revalidatePublicGeneralPagesData() {
  revalidateTag(CACHE_TAGS.generalPages);
  revalidatePath("/terms");
  revalidatePath("/privacy");
  revalidatePath("/refund");
  revalidatePath("/about/our-company");
  revalidatePath("/about/careers");
}

export function revalidatePublicSeoData() {
  revalidateTag(CACHE_TAGS.seoSettings);
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/blogs");
  revalidatePath("/about/our-company");
  revalidatePath("/terms");
  revalidatePath("/privacy");
  revalidatePath("/refund");
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

export function safeRevalidatePublicVideoTestimonialsData() {
  safeRevalidate(() => revalidatePublicVideoTestimonialsData());
}

export function safeRevalidatePublicHomeFaqsData() {
  safeRevalidate(() => revalidatePublicHomeFaqsData());
}

export function safeRevalidatePublicGeneralPagesData() {
  safeRevalidate(() => revalidatePublicGeneralPagesData());
}

export function safeRevalidatePublicSeoData() {
  safeRevalidate(() => revalidatePublicSeoData());
}
