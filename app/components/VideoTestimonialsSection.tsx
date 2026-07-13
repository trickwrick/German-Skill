"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { VideoTestimonial } from "../../data/videoTestimonials";
import { formatTestimonialRating, getTestimonialDescription, getYoutubeEmbedUrl } from "../../lib/videoTestimonialUtils";

type VideoTestimonialsSectionProps = {
  testimonials: VideoTestimonial[];
};

function useSlidesPerView() {
  const [slidesPerView, setSlidesPerView] = useState(4);

  useEffect(() => {
    function update() {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesPerView(1);
      } else if (width < 1024) {
        setSlidesPerView(2);
      } else if (width < 1280) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(4);
      }
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return slidesPerView;
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l11.02-6.86a1 1 0 000-1.68L9.54 4.3A1 1 0 008 5.14z" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRow({ rating, className = "" }: { rating: number; className?: string }) {
  const filled = Math.round(rating);
  return (
    <div
      className={`video-testimonial-stars ${className}`.trim()}
      aria-label={`${formatTestimonialRating(rating)} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < filled ? "is-filled" : ""}>
          ★
        </span>
      ))}
      <em>{formatTestimonialRating(rating)}</em>
    </div>
  );
}

type VideoModalProps = {
  testimonials: VideoTestimonial[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function VideoModal({ testimonials, activeIndex, onClose, onPrev, onNext }: VideoModalProps) {
  const current = testimonials[activeIndex];
  const embedUrl = current ? getYoutubeEmbedUrl(current.youtubeUrl) : null;
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < testimonials.length - 1;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft" && hasPrev) {
        onPrev();
      }
      if (event.key === "ArrowRight" && hasNext) {
        onNext();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!current || !embedUrl || !mounted) {
    return null;
  }

  return createPortal(
    <div className="video-testimonial-modal" role="dialog" aria-modal="true" aria-label="Student video testimonial">
      <button type="button" className="video-testimonial-modal-backdrop" onClick={onClose} aria-label="Close video" />

      <div className="video-testimonial-modal-shell">
        <button type="button" className="video-testimonial-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="video-testimonial-modal-split">
          <div className="video-testimonial-modal-video-stage">
            <button
              type="button"
              className="video-testimonial-modal-video-nav video-testimonial-modal-video-nav-prev"
              onClick={onPrev}
              disabled={!hasPrev}
              aria-label="Previous testimonial video"
            >
              <ChevronIcon direction="left" />
            </button>

            <div className="video-testimonial-modal-video">
              <iframe
                key={`${current.id}-${activeIndex}`}
                src={embedUrl}
                title={`${current.name} testimonial video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <button
              type="button"
              className="video-testimonial-modal-video-nav video-testimonial-modal-video-nav-next"
              onClick={onNext}
              disabled={!hasNext}
              aria-label="Next testimonial video"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>

          <aside className="video-testimonial-modal-side">
            <div className="video-testimonial-modal-side-body">
              <span className="video-testimonial-modal-label">Fluent AUF Student</span>
              <h3>{current.name}</h3>
              <StarRow rating={current.rating} className="video-testimonial-stars-modal" />
              <p className="video-testimonial-modal-copy">{getTestimonialDescription(current)}</p>

              <div className="video-testimonial-modal-actions">
                <Link href="/contact" className="btn video-testimonial-modal-btn">
                  Join Free Demo
                </Link>
                <Link href="/courses" className="video-testimonial-modal-link">
                  Explore Courses →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function VideoTestimonialsSection({ testimonials }: VideoTestimonialsSectionProps) {
  const slidesPerView = useSlidesPerView();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const maxIndex = Math.max(0, testimonials.length - slidesPerView);
  const pageCount = maxIndex + 1;

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  const openVideo = useCallback((index: number) => {
    if (getYoutubeEmbedUrl(testimonials[index]?.youtubeUrl ?? "")) {
      setActiveModalIndex(index);
    }
  }, [testimonials]);

  const closeVideo = useCallback(() => {
    setActiveModalIndex(null);
  }, []);

  const goToPrevVideo = useCallback(() => {
    setActiveModalIndex((current) => (current !== null && current > 0 ? current - 1 : current));
  }, []);

  const goToNextVideo = useCallback(() => {
    setActiveModalIndex((current) =>
      current !== null && current < testimonials.length - 1 ? current + 1 : current,
    );
  }, [testimonials.length]);

  const trackStyle = useMemo(
    () => ({
      transform: `translateX(-${(activeIndex * 100) / slidesPerView}%)`,
    }),
    [activeIndex, slidesPerView],
  );

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="video-testimonials-section" id="video-testimonials">
      <div className="video-testimonials-glow video-testimonials-glow-top" aria-hidden="true" />
      <div className="video-testimonials-glow video-testimonials-glow-bottom" aria-hidden="true" />

      <div className="video-testimonials-inner">
        <div className="video-testimonials-header">
          <h2 className="video-testimonials-heading">
            Real Feedback, <span>Real Results</span>
          </h2>
        </div>

        <div className="video-testimonials-carousel">
          <button
            type="button"
            className="video-testimonials-nav"
            onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
            disabled={activeIndex === 0}
            aria-label="Previous testimonials"
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="video-testimonials-viewport">
            <div className="video-testimonials-track" style={trackStyle}>
              {testimonials.map((item, index) => (
                <article key={item.id} className="video-testimonial-card" style={{ flex: `0 0 ${100 / slidesPerView}%` }}>
                  <button
                    type="button"
                    className="video-testimonial-media"
                    onClick={() => openVideo(index)}
                    aria-label={`Play ${item.name}'s testimonial video`}
                  >
                    <Image
                      src={item.image}
                      alt={`${item.name} video testimonial`}
                      fill
                      sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 22vw"
                      className="video-testimonial-image"
                    />
                    <span className="video-testimonial-rating-badge">{formatTestimonialRating(item.rating)} ★</span>
                    <span className="video-testimonial-play">
                      <PlayIcon />
                    </span>
                    <span className="video-testimonial-overlay" aria-hidden="true" />
                    <span className="video-testimonial-meta">
                      <strong>{item.name}</strong>
                      <StarRow rating={item.rating} />
                    </span>
                  </button>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="video-testimonials-nav"
            onClick={() => setActiveIndex((index) => Math.min(maxIndex, index + 1))}
            disabled={activeIndex >= maxIndex}
            aria-label="Next testimonials"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>

        {pageCount > 1 ? (
          <div className="video-testimonials-dots" role="tablist" aria-label="Testimonial pages">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial page ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {activeModalIndex !== null ? (
        <VideoModal
          testimonials={testimonials}
          activeIndex={activeModalIndex}
          onClose={closeVideo}
          onPrev={goToPrevVideo}
          onNext={goToNextVideo}
        />
      ) : null}
    </section>
  );
}
