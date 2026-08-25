import Link from "next/link";
import type { CityPage } from "../../../../data/cityPages";

type CityJourneyCtaProps = {
  page: CityPage;
};

function defaultJourneyCopy(cityName: string) {
  return `Achieve German language expertise from our German classes in ${cityName}, as we design courses that make your German learning journey easy and productive. Whether you are planning to learn German for driving better career or academic opportunities on a global scale, learn a new language as a hobby, or want to achieve immigration goals, we are here to train you with all the practical methods that can help you achieve fluency in the language. No matter what your learning goal is, we are here to help you learn a new language from beginner to advanced level. Browse through our courses and select the one that aligns with your learning goals now!`;
}

export default function CityJourneyCta({ page }: CityJourneyCtaProps) {
  const copy =
    page.ctaText.trim().length > 120
      ? page.ctaText.trim()
      : defaultJourneyCopy(page.cityName);

  const buttonText = page.ctaButtonText?.trim() || "Start Your Journey Now";

  return (
    <section className="city-journey-cta">
      <div className="city-journey-cta-inner">
        <div className="city-journey-card">
          <p className="city-journey-copy">{copy}</p>
          <Link href="/contact" className="city-journey-btn">
            {buttonText}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
