import Image from "next/image";
import Link from "next/link";

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="hero-banner" id="home">
      <Image
        src="/hero-students.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-banner-image"
      />
      <div className="hero-banner-overlay" aria-hidden="true" />

      <div className="hero-banner-content">
        <h1>
          Learn German Online –{" "}
          <span className="hero-accent-blue">A1–B2</span> German Language Course
        </h1>
        <p>
          Flexible Batches | A1–B2 Goethe Certified | Live Classes
        </p>
        <div className="hero-banner-actions">
          <Link href="/contact" className="btn-hero-primary">
            Book A Demo
          </Link>
          <Link href="/contact" className="btn-hero-secondary">
            Play Sample Demo
            <PlayIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
