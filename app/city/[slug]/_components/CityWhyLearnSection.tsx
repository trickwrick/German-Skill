import type { CityWhyFeatureItem, CityWhyLearnSectionData } from "../../../../data/cityPages";
import CityRichHtml from "./CityRichHtml";

type CityWhyLearnSectionProps = {
  cityName: string;
  data: CityWhyLearnSectionData;
};

const featureIcons: Record<CityWhyFeatureItem["tone"] | "material" | "career", JSX.Element> = {
  demo: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
    </svg>
  ),
  exam: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  tutors: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 19c0-3.2 3-5.2 7-5.2s7 2 7 5.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  batch: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 9h18M8 4v5M16 4v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  material: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  career: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
};

export default function CityWhyLearnSection({ cityName, data }: CityWhyLearnSectionProps) {
  const default6Features: CityWhyFeatureItem[] = [
    {
      title: "Free Demo Classes",
      text: "Experience our teaching style before you enroll. Sit in a live session and decide with confidence.",
      badge: "100% Free",
      tone: "demo",
    },
    {
      title: "Exam-Focused Training",
      text: "Structured A1–C2 prep aligned with Goethe and TELC patterns, practice tests, and speaking drills.",
      badge: "Exam Ready",
      tone: "exam",
    },
    {
      title: "Certified German Tutors",
      text: "Learn from experienced, certified trainers who guide you with clear feedback every step of the way.",
      badge: "Expert Faculty",
      tone: "tutors",
    },
    {
      title: "Flexible Online Batches",
      text: "Choose 1-on-1 personalized sessions or small-group classes with flexible weekday and weekend batches. Learn from anywhere with live classes.",
      badge: "Live Online",
      tone: "batch",
    },
    {
      title: "Study Material & Quizzes",
      text: "Get structured German study materials, practice exercises, and interactive quizzes to reinforce your learning and build confidence alongside live classes.",
      badge: "Free Access",
      tone: "material" as any,
    },
    {
      title: "Career & Visa Guidance",
      text: "Guidance for university admissions, job seeker visas, blocked account, and Germany relocation pathways.",
      badge: "Career Ready",
      tone: "career" as any,
    },
  ];

  const features =
    Array.isArray(data.features) && data.features.length >= 6
      ? data.features
      : Array.isArray(data.features) && data.features.length > 0
      ? [...data.features, ...default6Features.slice(data.features.length)]
      : default6Features;

  return (
    <section className="city-why">
      <div className="city-why-inner">
        <header className="city-why-header">
          <h2>
            {data.headingBefore} <span>{data.headingHighlight}</span>
            {data.headingAfter}
          </h2>
          <CityRichHtml html={data.text} cityName={cityName} className="city-why-intro" />
        </header>

        <div className="city-why-features-grid">
          {features.slice(0, 6).map((card) => (
            <article key={card.title} className={`city-why-feature city-why-feature-${card.tone}`}>
              <span className="city-why-feature-icon" aria-hidden="true">
                {featureIcons[card.tone] || featureIcons.demo}
              </span>
              <div className="city-why-feature-body">
                <h3>{card.title}</h3>
                <CityRichHtml html={card.text} cityName={cityName} />
                <span className="city-why-feature-badge">{card.badge}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
