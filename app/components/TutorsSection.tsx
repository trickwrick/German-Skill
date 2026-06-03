"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";

const tutors = [
  { name: "Khusi Sharma", image: "/courses/khusi-sharma.jpg" },
  { name: "Arti", image: "/courses/instructor.jpg" },
  { name: "Vibha", image: "/portal-education.jpg" },
  { name: "Shubhra", image: "/webinar-student.jpg" },
  { name: "Payal", image: "/hero-students.jpg" },
  { name: "Neha", image: "/courses/german-a1.jpg" },
  { name: "Rahul", image: "/courses/german-hero.jpg" },
  { name: "Priya", image: "/portal-education.jpg" },
];

const tutorsPerSlide = 4;

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
          <button
            type="button"
            className="tutors-arrow tutors-arrow-prev"
            aria-label="Previous tutors"
            onClick={() => goToSlide(activeSlide - 1)}
          >
            ‹
          </button>

          <div className="tutors-track-wrap">
            <div
              className="tutors-track"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {slides.map((slide, slideIndex) => (
                <div key={`slide-${slideIndex}`} className="tutors-slide">
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
                      <div className="tutor-card-name">{tutor.name}</div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="tutors-arrow tutors-arrow-next"
            aria-label="Next tutors"
            onClick={() => goToSlide(activeSlide + 1)}
          >
            ›
          </button>
        </div>

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
      </div>
    </section>
  );
}
