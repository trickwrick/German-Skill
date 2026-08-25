import Image from "next/image";
import Link from "next/link";
import type { CityVisionSectionData } from "../../../../data/cityPages";
import CityRichHtml from "./CityRichHtml";

type CityVisionSectionProps = {
  cityName: string;
  data: CityVisionSectionData;
};

export default function CityVisionSection({ cityName, data }: CityVisionSectionProps) {
  const highlight = data.headingHighlight?.trim() || cityName;

  return (
    <section className="city-vision">
      <div className="city-vision-inner">
        <div className="city-vision-copy">
          <span className="city-vision-tag">{data.tag || "Our Vision"}</span>
          <h2>
            {data.heading} <span>{highlight}</span>
            {data.headingSuffix || ""}
          </h2>
          <CityRichHtml html={data.text} className="city-vision-text" />
          <ul className="city-vision-list">
            {(data.points ?? []).map((point, index) => (
              <li key={`vision-point-${index}`}>
                <CityRichHtml html={point} />
              </li>
            ))}
          </ul>
          {data.linkText ? (
            <Link href={data.linkHref || "/about/our-company"} className="city-vision-link">
              {data.linkText}
            </Link>
          ) : null}
        </div>

        <div className="city-vision-visual">
          <div className="city-vision-image-wrap">
            <Image
              src={data.imageSrc || "/hero-students.jpg"}
              alt={data.imageAlt || `Fluent AUF German language learners from ${cityName}`}
              title={data.imageAlt || `Fluent AUF German language learners from ${cityName}`}
              width={560}
              height={420}
              className="city-vision-image"
            />
          </div>
          <div className="city-vision-badge">
            <strong>{data.badgeValue}</strong>
            <span>{data.badgeLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
