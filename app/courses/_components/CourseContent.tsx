"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { CourseContent } from "../../../data/courseContent.types";
import CourseEnrollModal from "./CourseEnrollModal";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#dcfce7" />
      <path d="M8 12.5l2.5 2.5L16 9" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GermanyMap() {
  return (
    <svg className="germany-map" viewBox="0 0 200 240" aria-hidden="true">
      <path
        d="M40 20 L160 15 L175 80 L165 140 L140 200 L100 225 L60 200 L35 140 L25 80 Z"
        fill="#1a1a1a"
      />
      <path
        d="M40 20 L160 15 L175 80 L165 140 L140 200 L100 225 L60 200 L35 140 L25 80 Z"
        fill="#dd0000"
        clipPath="url(#germanyMid)"
      />
      <path
        d="M40 20 L160 15 L175 80 L165 140 L140 200 L100 225 L60 200 L35 140 L25 80 Z"
        fill="#ffce00"
        clipPath="url(#germanyBot)"
      />
      <defs>
        <clipPath id="germanyMid">
          <rect x="0" y="80" width="200" height="80" />
        </clipPath>
        <clipPath id="germanyBot">
          <rect x="0" y="160" width="200" height="80" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ObjectiveList({ items }: { items: string[] }) {
  return (
    <ul className="objective-list">
      {items.map((item) => (
        <li key={item}>
          <CheckIcon />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function StarRow({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
            fill={star <= rating ? "#16a34a" : "none"}
            stroke="#16a34a"
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

function ReviewsPanel({ content }: { content: CourseContent }) {
  const { reviewsSummary, reviews } = content;

  return (
    <div className="course-tab-panel reviews-panel">
      <div className="reviews-summary-grid">
        <div className="reviews-average-box">
          <strong className="reviews-average-score">{reviewsSummary.average}</strong>
          <StarRow rating={4} size={22} />
          <span className="reviews-count">{reviewsSummary.total} ratings</span>
        </div>

        <div className="reviews-breakdown-box">
          {reviewsSummary.breakdown.map((row) => (
            <div key={row.stars} className="reviews-breakdown-row">
              <span className="reviews-breakdown-label">{row.stars} Stars</span>
              <div className="reviews-breakdown-bar">
                <div
                  className="reviews-breakdown-fill"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
              <span className="reviews-breakdown-percent">{row.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <p className="reviews-verify-note">{reviewsSummary.note}</p>

      <div className="reviews-list">
        {reviews.map((review) => (
          <article key={review.name + review.date} className="review-card">
            <div className="review-card-header">
              <div
                className="review-avatar"
                style={{ backgroundColor: review.color }}
                aria-hidden="true"
              >
                {review.initials}
              </div>
              <div>
                <strong>{review.name}</strong>
                <time>{review.date}</time>
              </div>
            </div>
            <StarRow rating={review.rating} size={16} />
            <p>{review.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

type CourseContentProps = {
  content: CourseContent;
  reviewCount: string;
  courseSlug: string;
  courseTitle: string;
};

export default function CourseContent({
  content,
  reviewCount,
  courseSlug,
  courseTitle,
}: CourseContentProps) {
  const reviewsTab = `Reviews (${reviewCount})`;
  const tabs = useMemo(() => ["Description", "FAQ", reviewsTab] as const, [reviewsTab]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Description");
  const [enrollOpen, setEnrollOpen] = useState(false);

  return (
    <section className="course-content-section">
      <div className="course-content-layout">
        <aside className="course-sidebar">
          <div className="course-price-box">
            <span className="course-price-label">Course Price</span>
            <strong>{content.sidebarPrice}</strong>
            <button type="button" className="btn btn-enroll" onClick={() => setEnrollOpen(true)}>
              Enroll now
            </button>
          </div>

          <CourseEnrollModal
            open={enrollOpen}
            courseSlug={courseSlug}
            courseTitle={courseTitle}
            onClose={() => setEnrollOpen(false)}
          />

          <div className="course-includes-box">
            <h3>This Course Includes:</h3>
            <ul>
              {content.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="course-map-box">
            <GermanyMap />
          </div>

          <div className="course-instructor-box">
            <h3>Course Instructor</h3>
            <div className="instructor-card">
              <div className="instructor-avatar">
                <Image
                  src={content.instructor.image}
                  alt={content.instructor.name}
                  width={80}
                  height={80}
                />
              </div>
              <strong>{content.instructor.name}</strong>
            </div>
          </div>

          <button type="button" className="course-share-btn">
            Share This Course
          </button>
        </aside>

        <div className="course-main">
          <div className="course-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={
                  activeTab === tab
                    ? `course-tab active${tab.startsWith("Reviews") ? " course-tab-reviews" : ""}`
                    : "course-tab"
                }
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Description" && (
            <div className="course-tab-panel">
              <h3>About This Course</h3>
              <p>{content.aboutCourse}</p>

              <h3>Course&apos;s Objectives (What you&apos;ll learn)</h3>
              <div className="objectives-grid">
                <ObjectiveList items={content.objectivesLeft} />
                <ObjectiveList items={content.objectivesRight} />
              </div>

              <h3>Course Description</h3>
              {content.courseDescription.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}

              <h3>GOALS/LESSONS</h3>
              <ul className="goals-list">
                {content.goalsLessons.map((goal) => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>

              <h3>You will learn the following:</h3>
              {content.curriculumSections.map((section) => (
                <div key={section.title} className="curriculum-block">
                  <h4>{section.title}</h4>
                  <p>{section.topics.join(" | ")}</p>
                </div>
              ))}

              <h3>Who This Course Is For:</h3>
              <ul className="audience-list">
                {content.targetAudience.map((item) => (
                  <li key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "FAQ" && (
            <div className="course-tab-panel">
              <h3>Frequently Asked Questions</h3>
              {content.faqs.map((faq) => (
                <div key={faq.q} className="faq-item">
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === reviewsTab && <ReviewsPanel content={content} />}
        </div>
      </div>
    </section>
  );
}
