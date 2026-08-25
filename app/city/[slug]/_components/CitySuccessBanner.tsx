import Image from "next/image";
import Link from "next/link";
import type { CitySuccessSectionData } from "../../../../data/cityPages";

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
  const images = data.mosaicImages.length ? data.mosaicImages : ["/hero-students.jpg"];
  const mosaicTiles = Array.from({ length: 48 }, (_, index) => ({
    src: images[index % images.length],
    key: `${images[index % images.length]}-${index}`,
  }));

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
            <p className="city-success-text">{data.text.replace(/\{city\}/gi, cityName)}</p>
            <Link href={data.buttonHref || "/contact"} className="city-success-btn">
              {data.buttonText || "Enquire Now"}
              <SendIcon />
            </Link>
          </div>

          <div className="city-success-mosaic" aria-hidden="true">
            {mosaicTiles.map((tile) => (
              <div key={tile.key} className="city-success-tile">
                <Image src={tile.src} alt="" fill sizes="80px" className="city-success-tile-img" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
