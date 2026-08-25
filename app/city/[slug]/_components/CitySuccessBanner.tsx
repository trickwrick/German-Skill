import Image from "next/image";
import Link from "next/link";
import type { CitySuccessSectionData } from "../../../../data/cityPages";
import CityRichHtml from "./CityRichHtml";

type CitySuccessBannerProps = {
  cityName: string;
  data: CitySuccessSectionData;
};

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CitySuccessBanner({ cityName, data }: CitySuccessBannerProps) {
  const imageSrc = data.imageSrc?.trim() || "/hero-students.jpg";
  const imageAlt =
    data.imageAlt?.trim() || `Successful German learners from ${cityName}`;

  return (
    <section className="city-success">
      <div className="city-success-inner">
        <div className="city-success-card">
          <div className="city-success-copy">
            <span className="city-success-badge">{data.badge}</span>
            <p className="city-success-kicker">{data.kicker}</p>
            <h2>
              {data.heading} <span>{data.headingHighlight}</span>
            </h2>
            <CityRichHtml html={data.text} cityName={cityName} className="city-success-text" />
            <Link href={data.buttonHref || "/contact"} className="city-success-btn">
              {data.buttonText || "Enquire Now"}
              <SendIcon />
            </Link>
          </div>

          <div className="city-success-visual">
            <Image
              src={imageSrc}
              alt={imageAlt}
              title={imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              className="city-success-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
