import Image from "next/image";
import Link from "next/link";
import { sitePhoneDisplay, sitePhoneTel } from "../../../../data/siteContact";

type CityWhyLearnSectionProps = {
  cityName: string;
};

const collageItems = [
  {
    src: "/portal-education.jpg",
    alt: "Live German classroom session",
    label: "Live Classroom Sessions",
    className: "city-why-shot city-why-shot-a",
  },
  {
    src: "/webinar-student.jpg",
    alt: "Student learning German online",
    label: "Interactive Online Classes",
    className: "city-why-shot city-why-shot-b",
  },
  {
    src: "/hero-students.jpg",
    alt: "Students preparing for German exams",
    label: "Goethe & TELC Preparation",
    className: "city-why-shot city-why-shot-c",
  },
];

const featureCards = [
  {
    title: "Free Demo Classes",
    text: "Experience our teaching style before you enroll. Sit in a live session and decide with confidence.",
    badge: "100% Free",
    tone: "demo",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Exam-Focused Training",
    text: "Structured A1–C2 prep aligned with Goethe and TELC patterns, practice tests, and speaking drills.",
    badge: "Exam Ready",
    tone: "exam",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Certified German Tutors",
    text: "Learn from experienced, certified trainers who guide you with clear feedback every step of the way.",
    badge: "Expert Faculty",
    tone: "tutors",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M5 19c0-3.2 3-5.2 7-5.2s7 2 7 5.2" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: "Flexible Online Batches",
    text: "Join weekday or weekend batches from {city} or anywhere — small groups, live classes, recorded support.",
    badge: "Live Online",
    tone: "batch",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 9h18M8 4v5M16 4v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
];

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CityWhyLearnSection({ cityName }: CityWhyLearnSectionProps) {
  return (
    <section className="city-why">
      <div className="city-why-inner">
        <header className="city-why-header">
          <h2>
            Why Learn at <span>Fluent AUF</span>?
          </h2>
          <p>
            Build real German fluency with live classes, certified tutors, and exam-focused guidance —
            trusted by learners in {cityName} and across India.
          </p>
          <div className="city-why-actions">
            <a href={`tel:${sitePhoneTel}`} className="city-why-phone">
              <PhoneIcon />
              {sitePhoneDisplay}
            </a>
            <Link href="/contact" className="city-why-callback">
              <PhoneIcon />
              Request A Call Back
            </Link>
          </div>
        </header>

        <div className="city-why-grid">
          <div className="city-why-collage">
            {collageItems.map((item) => (
              <figure key={item.label} className={item.className}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  title={item.label}
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                  className="city-why-shot-img"
                />
                <figcaption>{item.label}</figcaption>
              </figure>
            ))}
          </div>

          <div className="city-why-features">
            {featureCards.map((card) => (
              <article key={card.title} className={`city-why-feature city-why-feature-${card.tone}`}>
                <span className="city-why-feature-icon" aria-hidden="true">
                  {card.icon}
                </span>
                <div className="city-why-feature-body">
                  <h3>{card.title}</h3>
                  <p>{card.text.replace("{city}", cityName)}</p>
                  <span className="city-why-feature-badge">{card.badge}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
