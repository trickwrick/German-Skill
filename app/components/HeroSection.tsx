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
          Learn German Online for{" "}
          <span className="hero-accent-blue">Goethe, TELC,</span> and{" "}
          <span className="hero-accent-red">Study in Germany</span>
        </h1>
        <p>
          Sign up for our curated German exam preparation courses to learn from expert tutors.
          Get in touch now!
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
