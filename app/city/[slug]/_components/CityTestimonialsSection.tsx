"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CityTestimonialsSectionData, CityTestimonialItem } from "../../../../data/cityPages";

const INITIAL_VISIBLE = 6;

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

function TestimonialCard({ item }: { item: CityTestimonialItem }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-user">
        <div
          className="testimonial-avatar"
          style={{ backgroundColor: item.color || "#3498db" }}
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

export default function CityTestimonialsSection({ data }: { data?: CityTestimonialsSectionData }) {
  const [expanded, setExpanded] = useState(false);
  const [moreHeight, setMoreHeight] = useState(0);
  const moreRef = useRef<HTMLDivElement>(null);

  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const testimonials = data.items;
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
  }, [expanded]);

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-inner">
        <div className="testimonials-header">
          <span className="testimonials-tag">{data.tag || "Testimonials"}</span>
          <h2>{data.heading}</h2>
        </div>

        <div className="testimonials-grid">
          {visibleTestimonials.map((item) => (
            <TestimonialCard key={item.id} item={item} />
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
                <TestimonialCard key={item.id} item={item} />
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
