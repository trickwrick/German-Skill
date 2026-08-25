import Link from "next/link";
import type { CityJourneySectionData } from "../../../../data/cityPages";
import CityRichHtml from "./CityRichHtml";

type CityJourneyCtaProps = {
  data: CityJourneySectionData;
};

export default function CityJourneyCta({ data }: CityJourneyCtaProps) {
  return (
    <section className="city-journey-cta">
      <div className="city-journey-cta-inner">
        <div className="city-journey-card">
          <CityRichHtml html={data.text} className="city-journey-copy" />
          <Link href={data.buttonHref || "/contact"} className="city-journey-btn">
            {data.buttonText || "Start Your Journey Now"}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
