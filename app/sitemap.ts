import type { MetadataRoute } from "next";
import { blogPosts } from "../data/blogPosts";
import { germanCourses } from "../data/germanCourses";
import { getGermanCoursesForDisplay } from "../lib/courseContentStore";
import { getCityPagesForDisplay } from "../lib/cityPageStore";
import { buildCityPagePath } from "../lib/cityPageUtils";
import { COURSES_PAGE_PATH } from "../lib/sitePaths";
import { getBlogPosts } from "../lib/blogStore";

const siteUrl = "https://fluentauf.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}${COURSES_PAGE_PATH}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about/our-company`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about/our-faculties`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about/faqs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/german-teacher-job-portal`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/refund`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/city`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  let displayCourses = germanCourses;
  try {
    displayCourses = await getGermanCoursesForDisplay();
  } catch {
    // Fall back to static catalogue if live course fetch fails during sitemap build.
  }

  const courseRoutes: MetadataRoute.Sitemap = displayCourses.map((course) => ({
    url: `${siteUrl}/course/${course.pathName}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  let allBlogPosts = blogPosts;
  try {
    const dynamicBlogs = await getBlogPosts();
    if (dynamicBlogs && dynamicBlogs.length > 0) {
      allBlogPosts = dynamicBlogs as any;
    }
  } catch {
    // Fall back to static if fetch fails
  }

  const blogRoutes: MetadataRoute.Sitemap = allBlogPosts.map((p) => {
    const post = p as any;
    return {
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  let cityRoutes: MetadataRoute.Sitemap = [];
  try {
    const cityPages = await getCityPagesForDisplay();
    cityRoutes = cityPages.map((page) => ({
      url: `${siteUrl}${buildCityPagePath(page.slug)}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch {
    // Skip city routes if store is unavailable during build.
  }

  return [...staticRoutes, ...courseRoutes, ...blogRoutes, ...cityRoutes];
}
