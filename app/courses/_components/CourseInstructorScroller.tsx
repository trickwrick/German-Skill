"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trainers } from "../../../data/facultyMembers";

const AUTO_PLAY_MS = 4000;
const USER_SCROLL_PAUSE_MS = 4000;

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CourseInstructorScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [userScrollPaused, setUserScrollPaused] = useState(false);

  function scrollToIndex(index: number, loop = false, smooth = true) {
    const track = trackRef.current;
    if (!track || trainers.length === 0) {
      return;
    }

    const nextIndex = loop
      ? ((index % trainers.length) + trainers.length) % trainers.length
      : Math.max(0, Math.min(index, trainers.length - 1));

    const card = track.children[nextIndex] as HTMLElement | undefined;
    if (card) {
      const targetLeft = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
      const left = Math.max(0, targetLeft);

      if (smooth) {
        track.scrollTo({ left, behavior: "smooth" });
      } else {
        track.scrollLeft = left;
      }
    }

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }

  function handleTrackScroll() {
    const track = trackRef.current;
    if (!track || track.children.length === 0) {
      return;
    }

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(track.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const cardCenter = element.offsetLeft + element.clientWidth / 2;
      const distance = Math.abs(trackCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    activeIndexRef.current = closestIndex;
    setActiveIndex(closestIndex);
  }

  function pauseFromUserScroll() {
    pauseUntilRef.current = Date.now() + USER_SCROLL_PAUSE_MS;
    setUserScrollPaused(true);
  }

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.4, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let resumeTimer: number | undefined;

    const onPageScroll = () => {
      pauseFromUserScroll();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        if (Date.now() >= pauseUntilRef.current) {
          setUserScrollPaused(false);
        }
      }, USER_SCROLL_PAUSE_MS);
    };

    window.addEventListener("scroll", onPageScroll, { passive: true });
    window.addEventListener("touchmove", onPageScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onPageScroll);
      window.removeEventListener("touchmove", onPageScroll);
      window.clearTimeout(resumeTimer);
    };
  }, []);

  useEffect(() => {
    if (trainers.length <= 1 || isHovered || !isVisible || userScrollPaused) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) {
        return;
      }

      scrollToIndex(activeIndexRef.current + 1, true, false);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [isHovered, isVisible, userScrollPaused]);

  return (
    <div
      ref={containerRef}
      className="course-instructor-box"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsHovered(false);
        }
      }}
    >
      <h3>Course Instructor</h3>

      <div className="instructor-scroller">
        <button
          type="button"
          className="instructor-scroller-arrow"
          aria-label="Previous instructor"
          onClick={() => scrollToIndex(activeIndex - 1, true)}
        >
          <ArrowIcon direction="prev" />
        </button>

        <div ref={trackRef} className="instructor-scroller-track" onScroll={handleTrackScroll}>
          {trainers.map((tutor) => (
            <article key={tutor.name} className="instructor-card">
              <div className="instructor-avatar">
                <Image src={tutor.image} alt={tutor.name} title={tutor.name} width={80} height={80} />
              </div>
              <strong>{tutor.name}</strong>
              <span className="instructor-role">{tutor.role}</span>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="instructor-scroller-arrow"
          aria-label="Next instructor"
          onClick={() => scrollToIndex(activeIndex + 1, true)}
        >
          <ArrowIcon direction="next" />
        </button>
      </div>

      <div className="instructor-scroller-dots" aria-hidden={trainers.length <= 1}>
        {trainers.map((tutor, index) => (
          <button
            key={tutor.name}
            type="button"
            className={`instructor-scroller-dot${activeIndex === index ? " is-active" : ""}`}
            aria-label={`Show ${tutor.name}`}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
