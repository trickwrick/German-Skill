import Image from "next/image";
import Link from "next/link";

type CityVisionSectionProps = {
  cityName: string;
};

const visionPoints = [
  "Make quality German education accessible to learners in every city through live online classes.",
  "Build exam-ready fluency with Goethe and TELC focused training from A1 to C2.",
  "Help students gain confidence to study, work, and settle abroad with practical language skills.",
];

export default function CityVisionSection({ cityName }: CityVisionSectionProps) {
  return (
    <section className="city-vision">
      <div className="city-vision-inner">
        <div className="city-vision-copy">
          <span className="city-vision-tag">Our Vision</span>
          <h2>
            Empowering German learners in <span>{cityName}</span> and beyond
          </h2>
          <p>
            At Fluent AUF, our vision is to help learners in {cityName} and across India achieve
            real German fluency — not just textbook knowledge, but the confidence to communicate in
            exams, interviews, and everyday life abroad.
          </p>
          <ul className="city-vision-list">
            {visionPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Link href="/about/our-company" className="city-vision-link">
            Learn more about Fluent AUF
          </Link>
        </div>

        <div className="city-vision-visual">
          <div className="city-vision-image-wrap">
            <Image
              src="/hero-students.jpg"
              alt={`Fluent AUF German language learners from ${cityName}`}
              title={`Fluent AUF German language learners from ${cityName}`}
              width={560}
              height={420}
              className="city-vision-image"
            />
          </div>
          <div className="city-vision-badge">
            <strong>16,000+</strong>
            <span>Students learning with us</span>
          </div>
        </div>
      </div>
    </section>
  );
}
