import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { getCourseBySlug } from "../data/germanCourses";
import { COURSES_PAGE_PATH } from "./sitePaths";

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
  cityPages: "city-pages",
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

export function revalidatePublicCourseData(...slugsOrPaths: string[]) {
  revalidateTag(CACHE_TAGS.courses);
  revalidatePath("/");
  revalidatePath(COURSES_PAGE_PATH);
  revalidatePath("/courses");

  for (const value of slugsOrPaths) {
    const trimmed = value.trim();
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
  revalidatePath("/about/apply-job");
  revalidatePath(COURSES_PAGE_PATH);
  revalidatePath("/courses");
  revalidatePath("/");
  revalidatePath("/city", "layout");
}

export function revalidatePublicCityPagesData(...slugs: string[]) {
  revalidateTag(CACHE_TAGS.cityPages);
  revalidatePath("/city");

  for (const slug of slugs) {
    const trimmed = slug.trim();
    if (trimmed) {
      revalidatePath(`/city/${trimmed}`);
      revalidatePath(`/german-classes-${trimmed}`);
    }
  }
}

export function revalidatePublicSeoData() {
  revalidateTag(CACHE_TAGS.seoSettings);
  revalidatePath("/");
  revalidatePath(COURSES_PAGE_PATH);
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

export function safeRevalidatePublicCityPagesData(...slugs: string[]) {
  safeRevalidate(() => revalidatePublicCityPagesData(...slugs));
}

export function safeRevalidatePublicSeoData() {
  safeRevalidate(() => revalidatePublicSeoData());
}
