import Image from "next/image";
import Link from "next/link";

type CitySuccessBannerProps = {
  cityName: string;
};

const mosaicImages = [
  "/tutors/khushi-sharma.jpg",
  "/tutors/preeti-sharma.jpg",
  "/tutors/khushi-birsat.jpg",
  "/hero-students.jpg",
  "/portal-education.jpg",
  "/webinar-student.jpg",
  "/og-share.png",
  "/courses/german-a1.png",
];

const mosaicTiles = Array.from({ length: 48 }, (_, index) => ({
  src: mosaicImages[index % mosaicImages.length],
  alt: `Fluent AUF learner ${index + 1}`,
}));

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

export default function CitySuccessBanner({ cityName }: CitySuccessBannerProps) {
  return (
    <section className="city-success">
      <div className="city-success-inner">
        <div className="city-success-card">
          <div className="city-success-copy">
            <span className="city-success-badge">Goethe &amp; TELC Focused</span>
            <p className="city-success-kicker">Learn German at Fluent AUF &amp; Unlock Your</p>
            <h2>
              Dream Opportunity <span>Abroad</span>
            </h2>
            <p className="city-success-text">
              Join 10,500+ successful students who built German fluency for study, work, and
              career growth — including learners from {cityName}.
            </p>
            <Link href="/contact" className="city-success-btn">
              Enquire Now
              <SendIcon />
            </Link>
          </div>

          <div className="city-success-mosaic" aria-hidden="true">
            {mosaicTiles.map((tile, index) => (
              <div key={`${tile.src}-${index}`} className="city-success-tile">
                <Image
                  src={tile.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="city-success-tile-img"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
