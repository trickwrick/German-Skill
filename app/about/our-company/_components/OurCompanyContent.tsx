import Image from "next/image";
import Link from "next/link";
import FacultyTeamsSection from "../../../components/FacultyTeamsSection";

const stats = [
  { value: "10,500+", label: "Happy Students" },
  { value: "2,100+", label: "Batches Completed" },
  { value: "21+", label: "Certified Trainers" },
  { value: "85%", label: "Exam Success Rate" },
];

const features = [
  {
    title: "Certified Faculty",
    text: "Goethe-trained instructors with real classroom experience across A1 to C2 levels.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    title: "Exam-Focused Curriculum",
    text: "Structured programs aligned with Goethe and telc patterns — grammar, speaking, and mocks.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 9h8M8 13h5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Flexible Learning",
    text: "Online, morning, and weekend batches designed for students and professionals.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Student Support",
    text: "Doubt sessions, progress tracking, and counsellor guidance from demo class to certification.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
];

const values = [
  {
    title: "Commitment",
    text: "Every learner gets focused attention from enrollment through exam results.",
  },
  {
    title: "Integrity",
    text: "Transparent fees, honest guidance, and quality teaching — no shortcuts.",
  },
  {
    title: "Excellence",
    text: "We continuously improve batches, materials, and methods to raise outcomes.",
  },
];

export default function OurCompanyContent() {
  return (
    <>
      <section className="oc-intro">
        <div className="oc-intro-inner">
          <div className="oc-intro-copy">
            <span className="oc-tag">Est. 2013</span>
            <h2>
              Building German fluency for <span>10,500+ learners</span> across India
            </h2>
            <p>
              Fluent AUF is a dedicated German language institute helping students, professionals,
              and aspirants achieve certification and confidence for study, work, and life in
              Germany.
            </p>
            <ul className="oc-intro-list">
              <li>A1 to C2 structured programs with certified trainers</li>
              <li>Goethe & telc exam preparation with mock tests</li>
              <li>Online batches with flexible timings</li>
            </ul>
            <div className="oc-intro-actions">
              <Link href="/#courses" className="btn btn-primary">
                Explore Courses
              </Link>
              <Link href="/contact" className="oc-btn-secondary">
                Talk to Us
              </Link>
            </div>
          </div>

          <div className="oc-intro-visual">
            <div className="oc-intro-frame">
              <Image
                src="/hero-students.jpg"
                alt="Fluent AUF students in a learning session"
                width={560}
                height={420}
                className="oc-intro-photo"
                priority
              />
            </div>
            <div className="oc-intro-badge">
              <strong>13+</strong>
              <span>Years of trust</span>
            </div>
          </div>
        </div>
      </section>

      <section className="oc-stats-bar">
        <div className="oc-stats-inner">
          {stats.map((item) => (
            <div key={item.label} className="oc-stat">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="oc-features">
        <div className="oc-section-head">
          <span className="oc-tag oc-tag-gold">Our Edge</span>
          <h2>Why learners choose Fluent AUF</h2>
          <p>
            A professional institute built around results — not just syllabus completion, but real
            language ability and exam readiness.
          </p>
        </div>
        <div className="oc-features-grid">
          {features.map((item) => (
            <article key={item.title} className="oc-feature-card">
              <span className="oc-feature-icon" aria-hidden="true">
                {item.icon}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="oc-values">
        <div className="oc-values-inner">
          <div className="oc-values-head">
            <span className="oc-tag">What we stand for</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="oc-values-grid">
            {values.map((item, index) => (
              <article key={item.title} className="oc-value-card">
                <span className="oc-value-num">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FacultyTeamsSection />

      <section className="oc-cta">
        <div className="oc-cta-card">
          <div className="oc-cta-copy">
            <h2>Ready to start your German journey?</h2>
            <p>
              Book a free demo class and experience our teaching approach before you enroll. No
              pressure — just clarity on the right level and batch for you.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary oc-cta-btn">
            Book Free Demo
          </Link>
        </div>
      </section>
    </>
  );
}
