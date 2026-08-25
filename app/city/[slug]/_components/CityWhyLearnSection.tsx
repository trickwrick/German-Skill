import Image from "next/image";
import type { CityWhyFeatureItem, CityWhyLearnSectionData } from "../../../../data/cityPages";
import CityRichHtml from "./CityRichHtml";

type CityWhyLearnSectionProps = {
  cityName: string;
  data: CityWhyLearnSectionData;
};

const featureIcons: Record<CityWhyFeatureItem["tone"], JSX.Element> = {
  demo: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
    </svg>
  ),
  exam: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  tutors: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 19c0-3.2 3-5.2 7-5.2s7 2 7 5.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  batch: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 9h18M8 4v5M16 4v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
};

const collageClass = ["city-why-shot-a", "city-why-shot-b", "city-why-shot-c"];

export default function CityWhyLearnSection({ cityName, data }: CityWhyLearnSectionProps) {
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

        <div className="city-why-grid">
          <div className="city-why-collage">
            {(data.collage ?? []).slice(0, 3).map((item, index) => (
              <figure
                key={`${item.label}-${index}`}
                className={`city-why-shot ${collageClass[index] || collageClass[0]}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt || item.label}
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
            {(data.features ?? []).map((card) => (
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
      </div>
    </section>
  );
}
