import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero-banner" id="home">
      <Image
        src="/hero-students.jpg"
        alt="Students learning German online with Fluent AUF"
        fill
        priority
        sizes="100vw"
        className="hero-banner-image"
      />
      <div className="hero-banner-overlay" aria-hidden="true" />

      <div className="hero-banner-content">
        <h1>
          Learn German Online{" "}
          <span className="hero-accent-blue">A1–C2</span>
          <br />
          by Certified Tutors
        </h1>
        <p>
          Flexible Batches | A1–C2 Goethe Certified | Live Classes
        </p>

        <div className="hero-stats">
          <div className="hero-stats-grid">
            <div className="hero-stat">
              <strong>16000+</strong>
              <span>Learners</span>
            </div>
            <div className="hero-stat">
              <strong>96%</strong>
              <span>Course Completion</span>
            </div>
          </div>
          <div className="hero-rating">
            <span className="hero-rating-stars" aria-hidden="true">
              ★★★★★
            </span>
            <span>4.8/5 Rated by 1000+ Students</span>
          </div>
        </div>

        <div className="hero-banner-actions">
          <Link href="/contact" className="btn-hero-primary">
            Book A Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
