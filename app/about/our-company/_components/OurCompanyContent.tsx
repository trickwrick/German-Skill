import Image from "next/image";
import Link from "next/link";
import type { OurCompanyPageData } from "../../../../data/generalPages";
import { defaultOurCompanyContent } from "../../../../data/generalPages";
import FacultyTeamsSection from "../../../components/FacultyTeamsSection";

const featureIcons = [
  (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h5" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
];

type OurCompanyContentProps = {
  content?: OurCompanyPageData;
};

export default function OurCompanyContent({ content = defaultOurCompanyContent }: OurCompanyContentProps) {
  return (
    <>
      <section className="oc-intro">
        <div className="oc-intro-inner">
          <div className="oc-intro-copy">
            <span className="oc-tag">{content.intro.tag}</span>
            <h2>
              {content.intro.heading} <span>{content.intro.headingHighlight}</span> {content.intro.headingSuffix}
            </h2>
            <p>{content.intro.description}</p>
            <ul className="oc-intro-list">
              {content.intro.listItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="oc-intro-actions">
              <Link href="/courses" className="btn btn-primary">
                {content.intro.primaryButtonText}
              </Link>
              <Link href="/contact" className="oc-btn-secondary">
                {content.intro.secondaryButtonText}
              </Link>
            </div>
          </div>

          <div className="oc-intro-visual">
            <div className="oc-intro-frame">
              <Image
                src={content.intro.imageSrc}
                alt={content.intro.imageAlt}
                title={content.intro.imageAlt}
                width={560}
                height={420}
                className="oc-intro-photo"
                priority
              />
            </div>
            <div className="oc-intro-badge">
              <strong>{content.intro.badgeValue}</strong>
              <span>{content.intro.badgeLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="oc-stats-bar">
        <div className="oc-stats-inner">
          {content.stats.map((item) => (
            <div key={item.label} className="oc-stat">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="oc-features">
        <div className="oc-section-head">
          <span className="oc-tag oc-tag-gold">{content.features.tag}</span>
          <h2>{content.features.heading}</h2>
          <p>{content.features.description}</p>
        </div>
        <div className="oc-features-grid">
          {content.features.items.map((item, index) => (
            <article key={item.title} className="oc-feature-card">
              <span className="oc-feature-icon" aria-hidden="true">
                {featureIcons[index] ?? featureIcons[0]}
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
            <span className="oc-tag">{content.values.tag}</span>
            <h2>{content.values.heading}</h2>
          </div>
          <div className="oc-values-grid">
            {content.values.items.map((item, index) => (
              <article key={item.title} className="oc-value-card">
                <span className="oc-value-num">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FacultyTeamsSection content={content.faculty} />

      <section className="oc-cta">
        <div className="oc-cta-card">
          <div className="oc-cta-copy">
            <h2>{content.cta.heading}</h2>
            <p>{content.cta.description}</p>
          </div>
          <Link href="/contact" className="btn btn-primary oc-cta-btn">
            {content.cta.buttonText}
          </Link>
        </div>
      </section>
    </>
  );
}
