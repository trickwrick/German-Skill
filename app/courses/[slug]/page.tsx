import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import SiteFooter from "../../components/SiteFooter";
import { getCourseContent } from "../../../data/courseContents";
import { germanCourses, getCourseBySlug } from "../../../data/germanCourses";
import CourseContent from "../_components/CourseContent";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return germanCourses.map((course) => ({ slug: course.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const course = getCourseBySlug(params.slug);
  if (!course) {
    return { title: "Course Not Found | Fluent AUF" };
  }

  return {
    title: `${course.title} | Fluent AUF`,
    description: course.description,
  };
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

export default function GermanCoursePage({ params }: PageProps) {
  const course = getCourseBySlug(params.slug);
  const content = getCourseContent(params.slug);

  if (!course || !content) notFound();

  return (
    <>
      <Navbar />
      <main>
      <section className="course-detail-hero">
        <Image
          src="/courses/german-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="course-detail-hero-image"
        />
        <div className="course-detail-hero-overlay" aria-hidden="true" />
        <div className="course-detail-hero-content">
          <h1>Course Details</h1>
          <nav className="course-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">•</span>
            <Link href="/#courses">German</Link>
            <span aria-hidden="true">•</span>
            <Link href="/#courses">All Courses</Link>
          </nav>
        </div>
      </section>

      <section className="course-detail-body">
        <div className="course-detail-inner">
          <h2 className="course-detail-title">{course.title}</h2>

          <div className="course-detail-stats">
            <StatItem
              icon={<PeopleIcon />}
              value={course.batchSize ?? "20-40 Students"}
              label="Offline Batch Size"
            />
            <StatItem
              icon={<ListIcon />}
              value={course.enrolled ?? "100+"}
              label="Students Enrolled"
            />
            <StatItem
              icon={<StarRating rating={course.rating ?? "4.5"} />}
              value={course.rating ?? "4.50"}
              label={`Reviews (${course.reviewCount ?? "0"})`}
            />
            <StatItem
              icon={<ClockIcon />}
              value={course.learningHours ?? course.hours}
              label="Learning Hours"
            />
          </div>
        </div>
      </section>

      <CourseContent
        content={content}
        reviewCount={course.reviewCount ?? String(content.reviewsSummary.total)}
        courseSlug={course.slug}
        courseTitle={course.title}
      />
      </main>
      <SiteFooter />
    </>
  );
}
