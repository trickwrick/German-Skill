"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CourseContent, CourseReview } from "../../../data/courseContent.types";
import CourseImage from "../../components/CourseImage";
import CourseEnrollModal from "./CourseEnrollModal";
import CourseInstructorScroller from "./CourseInstructorScroller";
import { formatDisplayPrice } from "../../../lib/courseUtils";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#dcfce7" />
      <path d="M8 12.5l2.5 2.5L16 9" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
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

function formatRatingDisplay(value: string) {
  const num = parseFloat(value);
  return Number.isNaN(num) ? value : num.toString();
}

function StarRow({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fillAmount = Math.max(0, Math.min(1, rating - star + 1));
        const gradientId = `review-star-${star}-${String(rating).replace(".", "-")}`;

        return (
          <svg key={star} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            {fillAmount > 0 && fillAmount < 1 ? (
              <>
                <defs>
                  <linearGradient id={gradientId}>
                    <stop offset={`${fillAmount * 100}%`} stopColor="#16a34a" />
                    <stop offset={`${fillAmount * 100}%`} stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                  fill={`url(#${gradientId})`}
                  stroke="#16a34a"
                  strokeWidth="1.5"
                />
              </>
            ) : (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                fill={fillAmount >= 1 ? "#16a34a" : "none"}
                stroke="#16a34a"
                strokeWidth="1.5"
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: CourseReview }) {
  return (
    <article className="review-card">
      <div className="review-card-header">
        <div
          className="review-avatar"
          style={{ backgroundColor: review.color }}
          aria-hidden="true"
        >
          {review.initials}
        </div>
        <div className="review-card-meta">
          <strong>{review.name}</strong>
          <time>{review.date}</time>
        </div>
      </div>
      <StarRow rating={review.rating} size={16} />
      <p>{review.text}</p>
    </article>
  );
}

function ReviewsPanel({
  content,
  reviewCount,
}: {
  content: CourseContent;
  reviewCount: string;
}) {
  const { reviewsSummary, reviews } = content;
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [moreHeight, setMoreHeight] = useState(0);
  const moreRef = useRef<HTMLDivElement>(null);
  const initialReviewCount = 3;
  const hasMoreReviews = reviews.length > initialReviewCount;
  const initialReviews = reviews.slice(0, initialReviewCount);
  const moreReviews = reviews.slice(initialReviewCount);

  useLayoutEffect(() => {
    const node = moreRef.current;
    if (!node) return;

    const updateHeight = () => {
      setMoreHeight(node.scrollHeight + 8);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [moreReviews.length]);

  return (
    <div className="course-tab-panel reviews-panel">
      <div className="reviews-summary-grid">
        <div className="reviews-average-box">
          <strong className="reviews-average-score">
            {formatRatingDisplay(reviewsSummary.average)}
          </strong>
          <StarRow rating={parseFloat(reviewsSummary.average) || 0} size={22} />
          <span className="reviews-count">{reviewCount} ratings</span>
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

      {reviewsSummary.note ? (
        <p className="reviews-verify-note">{reviewsSummary.note}</p>
      ) : null}

      {reviews.length === 0 ? (
        <p className="reviews-empty-note">No reviews have been added for this course yet.</p>
      ) : (
        <>
      <div className="reviews-list">
        {initialReviews.map((review) => (
          <ReviewCard key={review.name + review.date} review={review} />
        ))}
      </div>

      {hasMoreReviews ? (
        <div
          className={`reviews-more${showAllReviews ? " is-open" : ""}`}
          style={{ maxHeight: showAllReviews ? `${moreHeight}px` : "0px" }}
          aria-hidden={!showAllReviews}
        >
          <div ref={moreRef}>
            <div className="reviews-list reviews-list-more">
              {moreReviews.map((review) => (
                <ReviewCard key={review.name + review.date} review={review} />
              ))}
            </div>
            <p className="reviews-enroll-note">
              You can view more reviews once you enroll in this course.
            </p>
          </div>
        </div>
      ) : null}

      {hasMoreReviews ? (
        <div className="reviews-footer">
          <button
            type="button"
            className="btn btn-view-more"
            onClick={() => setShowAllReviews((open) => !open)}
            aria-expanded={showAllReviews}
          >
            {showAllReviews ? "View Less" : "View More"}
          </button>
        </div>
      ) : null}
        </>
      )}
    </div>
  );
}

type CourseContentProps = {
  content: CourseContent;
  reviewCount: string;
  courseSlug: string;
  courseTitle: string;
  courseImage: string;
  coursePrice?: string;
  originalPrice?: string;
};

export default function CourseContent({
  content,
  reviewCount,
  courseSlug,
  courseTitle,
  courseImage,
  coursePrice,
  originalPrice,
}: CourseContentProps) {
  const reviewsTab = `Reviews (${reviewCount})`;
  const tabs = useMemo(() => ["Description", "FAQ", reviewsTab] as const, [reviewsTab]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Description");
  const [enrollOpen, setEnrollOpen] = useState(false);

  function scrollToFlexibleBatches() {
    document.getElementById("flexible-batches")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="course-content-section">
      <div className="course-content-layout">
        <aside className="course-sidebar">
          <div className="course-price-box">
            <div className="course-price-image-wrap">
              <CourseImage
                src={courseImage}
                alt={courseTitle}
                fill
                sizes="300px"
                className="course-price-image"
              />
            </div>
            <div className="course-price-body">
              <span className="course-price-label">Course Price</span>
              <div className="course-price-row course-price-row-sidebar">
                <span className="course-price-sale">
                  {formatDisplayPrice(coursePrice ?? content.sidebarPrice)}
                </span>
                {originalPrice ? (
                  <span className="course-price-original">
                    {formatDisplayPrice(originalPrice)}
                  </span>
                ) : null}
              </div>
              <button type="button" className="btn btn-enroll" onClick={() => setEnrollOpen(true)}>
                Enroll now
              </button>
            </div>
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

          <CourseInstructorScroller />

          <button type="button" className="course-batches-btn" onClick={scrollToFlexibleBatches}>
            Flexible batches for you
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

          {activeTab === reviewsTab && (
            <ReviewsPanel content={content} reviewCount={reviewCount} />
          )}
        </div>
      </div>
    </section>
  );
}
