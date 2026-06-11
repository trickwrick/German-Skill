"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";

const tutors = [
  {
    name: "Khushi Sharma",
    image: "/tutors/khushi-sharma.jpg",
    qualification: "Certified German Trainer",
  },
  {
    name: "Khushi Birsat",
    image: "/tutors/khushi-birsat.jpg",
    qualification: "Certified German Trainer",
  },
];

const tutorsPerSlide = 2;

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "prev" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

function chunkTutors<T>(items: T[], size: number) {
  const slides: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    slides.push(items.slice(index, index + size));
  }

  return slides;
}

export default function TutorsSection() {
  const slides = useMemo(() => chunkTutors(tutors, tutorsPerSlide), []);
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveSlide((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  return (
    <section className="tutors-section" id="tutors">
      <div className="tutors-inner">
        <div className="tutors-header">
          <h2>Meet Our German Tutors</h2>
          <p>
            Learn from inspirational German language certified tutors who will guide and support
            you every step of the way.
          </p>
        </div>

        <div className="tutors-carousel">
          {slides.length > 1 ? (
            <button
              type="button"
              className="tutors-arrow tutors-arrow-prev"
              aria-label="Previous tutors"
              onClick={() => goToSlide(activeSlide - 1)}
            >
              <ChevronIcon direction="prev" />
            </button>
          ) : null}

          <div className="tutors-track-wrap">
            <div
              className="tutors-track"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {slides.map((slide, slideIndex) => (
                <div
                  key={`slide-${slideIndex}`}
                  className={`tutors-slide${slide.length === 2 && tutors.length === 2 ? " tutors-slide-duo" : ""}`}
                >
                  {slide.map((tutor) => (
                    <article key={tutor.name} className="tutor-card">
                      <div className="tutor-card-image-wrap">
                        <Image
                          src={tutor.image}
                          alt={tutor.name}
                          width={280}
                          height={320}
                          className="tutor-card-image"
                        />
                      </div>
                      <div className="tutor-card-body">
                        <div className="tutor-card-name">{tutor.name}</div>
                        <p className="tutor-card-qualification">{tutor.qualification}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {slides.length > 1 ? (
            <button
              type="button"
              className="tutors-arrow tutors-arrow-next"
              aria-label="Next tutors"
              onClick={() => goToSlide(activeSlide + 1)}
            >
              <ChevronIcon direction="next" />
            </button>
          ) : null}
        </div>

        {slides.length > 1 ? (
          <div className="tutors-dots" role="tablist" aria-label="Tutor slides">
            {slides.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                role="tab"
                aria-selected={index === activeSlide}
                aria-label={`Slide ${index + 1}`}
                className={`tutors-dot${index === activeSlide ? " is-active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
