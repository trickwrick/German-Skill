"use client";

import { useState } from "react";
import Link from "next/link";
import CourseImage from "./CourseImage";
import CourseEnrollModal from "../courses/_components/CourseEnrollModal";
import { getCourseHref, type GermanCourse } from "../../data/germanCourses";
import { defaultGermanLanguageCourseContent } from "../../data/generalPages";
import { formatDisplayPrice } from "../../lib/courseUtils";

type AllCoursesSectionProps = {
  courses: GermanCourse[];
  title?: string;
  description?: string;
};

export default function AllCoursesSection({
  courses,
  title,
  description,
}: AllCoursesSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<{ slug: string; title: string } | null>(null);

  const heading = title?.trim() || defaultGermanLanguageCourseContent.sectionTitle;
  const subtitle = description?.trim() || defaultGermanLanguageCourseContent.sectionDescription;

  const handleEnrollClick = (e: React.MouseEvent | React.KeyboardEvent, course: GermanCourse) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCourse({ slug: course.slug, title: course.title });
  };

  return (
    <>
      <section className="all-courses-section">
        <div className="all-courses-inner">
          <h2 className="all-courses-title">{heading}</h2>
          <p className="all-courses-subtitle">{subtitle}</p>

          <div className="all-courses-grid">
            {courses.map((course) => {
              const courseHref = getCourseHref(course);
              const ratingValue = course.rating ? Number(course.rating).toFixed(1) : "4.8";

              return (
                <Link key={course.slug} href={courseHref} className="course-card">
                  <span className="course-card-image-wrap">
                    <CourseImage
                      src={course.image}
                      alt={course.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="course-card-image"
                    />
                    <span className="course-card-online-badge">Online</span>
                    <span className="course-card-rating-badge">
                      <span className="star-icon">★</span> {ratingValue}
                    </span>
                  </span>
                  <div className="course-card-body">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-card-info-row">
                      <span className="course-hours">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {course.learningHours ?? course.hours}
                      </span>
                      <span className="course-registration-badge">
                        <span className="registration-dot" aria-hidden="true" />
                        REGISTRATION OPEN
                      </span>
                    </div>

                    <div className="course-card-action-row">
                      <div className="course-price-wrap">
                        <span className="course-price-sale">{formatDisplayPrice(course.price)}</span>
                        {course.originalPrice ? (
                          <span className="course-price-original">
                            {formatDisplayPrice(course.originalPrice)}
                          </span>
                        ) : null}
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        className="course-enroll-btn"
                        onClick={(e) => handleEnrollClick(e, course)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleEnrollClick(e, course);
                          }
                        }}
                      >
                        Enroll Now
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {selectedCourse && (
        <CourseEnrollModal
          open={Boolean(selectedCourse)}
          courseSlug={selectedCourse.slug}
          courseTitle={selectedCourse.title}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </>
  );
}
