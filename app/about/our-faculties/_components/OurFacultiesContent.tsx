import Link from "next/link";
import FacultyTeamsSection from "../../../components/FacultyTeamsSection";

export default function OurFacultiesContent() {
  return (
    <>
      <section className="of-intro">
        <div className="of-intro-inner">
          <span className="of-tag">21+ Certified Trainers</span>
          <h2>
            Learn from trainers who <span>know German exams inside out</span>
          </h2>
          <p>
            Our faculty combines classroom experience with Goethe and telc preparation expertise.
            Every trainer is selected for clarity, patience, and results — so you progress with
            confidence at every level from A1 to C2.
          </p>
        </div>
      </section>

      <FacultyTeamsSection />

      <section className="of-cta">
        <div className="of-cta-card">
          <div className="of-cta-copy">
            <h2>Want to learn with our faculty?</h2>
            <p>
              Book a free demo class and meet the teaching approach firsthand. We&apos;ll help you
              pick the right level and batch.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary of-cta-btn">
            Book Free Demo
          </Link>
        </div>
      </section>
    </>
  );
}
