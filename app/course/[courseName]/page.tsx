import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import SiteFooter from "../../components/SiteFooter";
import {
  getCourseByPathNameAsync,
  getCourseContentAsync,
  getCourseFlexibleBatchesAsync,
  getCoursePageSeoAsync,
  getCourseSeoContentAsync,
  getGermanCoursesForDisplay,
} from "../../../lib/courseContentStore";
import { getCourseContentForCourse } from "../../../data/courseContents";
import { germanCourses } from "../../../data/germanCourses";
import CourseContent from "../../courses/_components/CourseContent";
import FlexibleBatchesSection from "../../courses/_components/FlexibleBatchesSection";
import CourseSeoContentSection from "../../courses/_components/CourseSeoContentSection";
import JsonLd from "../../components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCourseSchema,
  buildPageMetadata,
} from "../../../lib/siteSeo";
import { PUBLIC_REVALIDATE_SECONDS } from "../../../lib/publicDataCache";

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

type PageProps = {
  params: { courseName: string };
};

export async function generateStaticParams() {
  try {
    const courses = await getGermanCoursesForDisplay();
    const params = courses
      .map((course) => course.pathName?.trim())
      .filter((pathName): pathName is string => Boolean(pathName))
      .map((courseName) => ({ courseName }));

    if (params.length > 0) {
      return params;
    }
  } catch {
    // Fall through to static defaults.
  }

  return germanCourses.map((course) => ({ courseName: course.pathName }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await getCourseByPathNameAsync(params.courseName);
  if (!course) {
    return buildPageMetadata({
      title: "Course Not Found | Fluent AUF",
      description: "The requested German language course could not be found on Fluent AUF.",
      path: "/courses",
      noIndex: true,
    });
  }

  const seo = await getCoursePageSeoAsync(course);

  return buildPageMetadata({
    title: seo.metaTitle || `${course.title} | Fluent AUF`,
    description: seo.metaDescription || course.description,
    path: `/course/${course.pathName}`,
    keywords: seo.metaKeyword || `${course.title}, German Language Course, Learn German, Online German Classes`,
    ogImage: course.image || undefined,
    ogImageAlt: `${course.title} — Fluent AUF German Course`,
  });
}

function PeopleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 20c.4-2.2 2-4 5-4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StarRating({ rating }: { rating: string }) {
  const num = parseFloat(rating);

  return (
    <div className="course-stat-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = num >= star;
        const half = !filled && num >= star - 0.5;

        return (
          <svg key={star} width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
            {half ? (
              <>
                <defs>
                  <linearGradient id={`stat-half-${star}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                  fill={`url(#stat-half-${star})`}
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </>
            ) : (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                fill={filled ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.4"
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="course-stat">
      <div className="course-stat-icon">{icon}</div>
      <div className="course-stat-body">
        <strong className="course-stat-value">{value}</strong>
        <span className="course-stat-label">{label}</span>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default async function GermanCoursePage({ params }: PageProps) {
  const displayCourse = await getCourseByPathNameAsync(params.courseName);
  if (!displayCourse) notFound();

  const [contentResult, batchesContent, seoContent] = await Promise.all([
    getCourseContentAsync(displayCourse.slug),
    getCourseFlexibleBatchesAsync(displayCourse.slug),
    getCourseSeoContentAsync(displayCourse.slug),
  ]);

  const content = contentResult ?? getCourseContentForCourse(displayCourse);

  const reviewCount = displayCourse.reviewCount || String(content.reviewsSummary.total) || "0";
  const salePrice = displayCourse.price || content.sidebarPrice;
  const coursePath = `/course/${displayCourse.pathName}`;
  const courseSchema = [
    buildCourseSchema({
      name: displayCourse.title,
      description: displayCourse.description,
      path: coursePath,
      image: displayCourse.image,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Courses", path: "/courses" },
      { name: displayCourse.title, path: coursePath },
    ]),
  ];

  return (
    <>
      <JsonLd data={courseSchema} />
      <Navbar />
      <main>
        <section className="course-detail-hero">
          <Image
            src="/courses/german-hero.jpg"
            alt="German language course students learning online with Fluent AUF"
            title="German language course students learning online with Fluent AUF"
            fill
            priority
            sizes="100vw"
            className="course-detail-hero-image"
          />
          <div className="course-detail-hero-overlay" aria-hidden="true" />
          <div className="course-detail-hero-content">
            <p className="course-detail-hero-label">Course Details</p>
            <nav className="course-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">•</span>
              <Link href="/courses">German</Link>
              <span aria-hidden="true">•</span>
              <Link href="/courses">All Courses</Link>
            </nav>
          </div>
        </section>

        <section className="course-detail-body">
          <div className="course-detail-inner">
            <h1 className="course-detail-title">{displayCourse.title}</h1>

            <div className="course-detail-stats">
              <StatItem
                icon={<PeopleIcon />}
                value={displayCourse.batchSize ?? "20-40 Students"}
                label="Online Batch Size"
              />
              <StatItem
                icon={<ListIcon />}
                value={displayCourse.enrolled ?? "100+"}
                label="Students Enrolled"
              />
              <StatItem
                icon={<StarRating rating={displayCourse.rating ?? "4.5"} />}
                value={
                  displayCourse.rating
                    ? parseFloat(displayCourse.rating).toString()
                    : "4.5"
                }
                label={`Reviews (${reviewCount})`}
              />
              <StatItem
                icon={<ClockIcon />}
                value={displayCourse.learningHours ?? displayCourse.hours}
                label="Duration"
              />
            </div>
          </div>
        </section>

        <CourseContent
          content={content}
          reviewCount={reviewCount}
          courseSlug={displayCourse.slug}
          courseTitle={displayCourse.title}
          courseImage={displayCourse.image}
          coursePrice={salePrice}
          originalPrice={displayCourse.originalPrice}
        />

        <FlexibleBatchesSection
          batchesContent={batchesContent}
          salePrice={salePrice}
          courseSlug={displayCourse.slug}
          courseTitle={displayCourse.title}
        />

        <CourseSeoContentSection html={seoContent} />
      </main>
      <SiteFooter />
    </>
  );
}
