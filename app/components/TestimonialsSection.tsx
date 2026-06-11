"use client";

import { useLayoutEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Swathi S",
    initial: "S",
    color: "#5b8def",
    review: "German learning became so easy with FluentAuf's live classes. The teachers explain everything clearly!",
    date: "2 weeks ago",
  },
  {
    name: "Tanushree Naidu",
    initial: "T",
    color: "#e67e22",
    review: "Interactive sessions and personal attention made a huge difference in my German journey.",
    date: "1 month ago",
  },
  {
    name: "Ajay Marcus",
    initial: "A",
    color: "#27ae60",
    review: "I gained confidence in speaking German through the live practice sessions at FluentAuf.",
    date: "3 weeks ago",
  },
  {
    name: "Riya Patel",
    initial: "R",
    color: "#9b59b6",
    review: "The classes are well-structured, engaging, and perfect for beginners as well as advanced learners.",
    date: "2 months ago",
  },
  {
    name: "Karthik Reddy",
    initial: "K",
    color: "#3498db",
    review: "FluentAuf helped me improve my grammar and vocabulary in a fun and practical way.",
    date: "1 week ago",
  },
  {
    name: "Priya Sharma",
    initial: "P",
    color: "#e74c3c",
    review: "The instructors are supportive and always ready to clear doubts during the live classes.",
    date: "1 month ago",
  },
  {
    name: "Mohammed Ali",
    initial: "M",
    color: "#1abc9c",
    review: "Thanks to FluentAuf, I can now communicate in German much more confidently.",
    date: "3 weeks ago",
  },
  {
    name: "Neha Gupta",
    initial: "N",
    color: "#f39c12",
    review: "Flexible timings and expert guidance make FluentAuf one of the best platforms to learn German.",
    date: "2 months ago",
  },
  {
    name: "David Thomas",
    initial: "D",
    color: "#34495e",
    review: "The live classes kept me motivated and consistent. Highly recommended for anyone learning German!",
    date: "4 weeks ago",
  },
];

const INITIAL_VISIBLE = 6;

type Testimonial = (typeof testimonials)[number];

function StarRating() {
  return (
    <div className="star-rating" aria-label="5 out of 5 stars">
      {"★★★★★"}
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-user">
        <div
          className="testimonial-avatar"
          style={{ backgroundColor: item.color }}
          aria-hidden="true"
        >
          {item.initial}
        </div>
        <div>
          <strong>{item.name}</strong>
          <StarRating />
        </div>
      </div>
      <p>{item.review}</p>
      <time className="testimonial-date">{item.date}</time>
    </article>
  );
}

export default function TestimonialsSection() {
  const [expanded, setExpanded] = useState(false);
  const [moreHeight, setMoreHeight] = useState(0);
  const moreRef = useRef<HTMLDivElement>(null);

  const visibleTestimonials = testimonials.slice(0, INITIAL_VISIBLE);
  const moreTestimonials = testimonials.slice(INITIAL_VISIBLE);
  const hasMore = moreTestimonials.length > 0;

  useLayoutEffect(() => {
    const node = moreRef.current;
    if (!node) return;

    const updateHeight = () => {
      setMoreHeight(node.scrollHeight + 24);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-inner">
        <div className="testimonials-header">
          <span className="testimonials-tag">Testimonials</span>
          <h2>We&apos;ve 16000+ Happy Students</h2>
        </div>

        <div className="testimonials-grid">
          {visibleTestimonials.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </div>

        {hasMore ? (
          <div
            className={`testimonials-more${expanded ? " is-open" : ""}`}
            style={{ maxHeight: expanded ? `${moreHeight}px` : "0px" }}
            aria-hidden={!expanded}
          >
            <div ref={moreRef} className="testimonials-grid testimonials-grid-more">
              {moreTestimonials.map((item) => (
                <TestimonialCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        ) : null}

        {hasMore ? (
          <div className="testimonials-footer">
            <button
              type="button"
              className="btn btn-view-more"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
            >
              {expanded ? "View Less" : "View More"}
              <ChevronDown className={`btn-view-more-icon${expanded ? " is-open" : ""}`} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
