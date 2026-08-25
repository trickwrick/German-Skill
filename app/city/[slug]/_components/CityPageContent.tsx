import Link from "next/link";
import type { CityPage } from "../../../../data/cityPages";
import type { GermanCourse } from "../../../../data/germanCourses";
import type { VideoTestimonial } from "../../../../data/videoTestimonials";
import { sanitizeBlogHtml } from "../../../../lib/blogHtmlUtils";
import { sitePhoneDisplay, sitePhoneTel, siteWhatsAppUrl } from "../../../../data/siteContact";
import AllCoursesSection from "../../../components/AllCoursesSection";
import CertificateSection from "../../../components/CertificateSection";
import ComparisonSection from "../../../components/ComparisonSection";
import TutorsSection from "../../../components/TutorsSection";
import VideoTestimonialsSection from "../../../components/VideoTestimonialsSection";
import CityLeadForm from "./CityLeadForm";
import CitySuccessBanner from "./CitySuccessBanner";
import CityWhyLearnSection from "./CityWhyLearnSection";

type CityPageContentProps = {
  page: CityPage;
  courses: GermanCourse[];
  videoTestimonials: VideoTestimonial[];
};

const proofStats = [
  {
    label: "Students learning with us",
    value: "16,000+",
    icon: "students",
  },
  {
    label: "Happy learners",
    value: "10,500+",
    icon: "partners",
  },
  {
    label: "Certified trainers",
    value: "Expert",
    icon: "trainers",
  },
  {
    label: "Free demo classes",
    value: "Book now",
    icon: "workshops",
  },
];

function CapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 12.5v4.2c0 .5 2.2 2.3 5 2.3s5-1.8 5-2.3v-4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRow() {
  return (
    <span className="city-rating-stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} width="12" height="12" viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}

function ProofIcon({ type }: { type: string }) {
  if (type === "students") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 19c0-2.8 2.5-5 6-5s6 2.2 6 5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M14 19c.3-1.8 1.7-3.2 3.8-3.6" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  if (type === "partners") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 14c-2.2 0-4 1.3-4 3v2h8v-2c0-1.7-1.8-3-4-3Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M16 14c2.2 0 4 1.3 4 3v2h-5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  if (type === "trainers") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="7" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M9 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 14a3 3 0 100-6 3 3 0 000 6Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 14v6M8 20h8M7 10c-1.7.8-3 2.6-3 4.7M17 10c1.7.8 3 2.6 3 4.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function renderSubtitle(subtitle: string) {
  const highlight = "German Communication";
  if (subtitle.includes(highlight)) {
    const [before, after] = subtitle.split(highlight);
    return (
      <>
        {before}
        <strong>{highlight}</strong>
        {after}
      </>
    );
  }

  const words = subtitle.trim().split(/\s+/);
  if (words.length <= 2) {
    return subtitle;
  }

  const tail = words.slice(-2).join(" ");
  const head = words.slice(0, -2).join(" ");
  return (
    <>
      {head} <strong>{tail}</strong>
    </>
  );
}

export default function CityPageContent({
  page,
  courses,
  videoTestimonials,
}: CityPageContentProps) {
  const contentHtml = sanitizeBlogHtml(page.contentHtml);
  const subtitle = page.subtitle?.trim() || "Build Confidence in German Communication";

  return (
    <>
      <section className="city-top">
        <div className="city-top-inner">
          <div className="city-top-grid">
            <div className="city-top-copy">
              <p className="city-crumb">
                <CapIcon />
                <span>/ German Classes in {page.cityName}</span>
              </p>

              <h1 className="city-top-title">{page.title}</h1>
              <p className="city-top-subtitle">{renderSubtitle(subtitle)}</p>

              <div className="city-rating-row">
                <div className="city-rating-box">
                  <span className="city-rating-count">3,852 Ratings</span>
                  <StarRow />
                  <Link href="/#testimonials" className="city-rating-link">
                    Read Reviews
                  </Link>
                </div>
                <div className="city-google-box">
                  <span className="city-google-mark" aria-hidden="true">
                    G
                  </span>
                  <span>Google 4.9 ★</span>
                </div>
              </div>

              <div className="city-top-actions">
                <Link href="/contact" className="city-callback-btn">
                  <PhoneIcon />
                  Request A Call Back
                </Link>
                <a href={`tel:${sitePhoneTel}`} className="city-phone-btn">
                  <PhoneIcon />
                  {sitePhoneDisplay.replace("+91 ", "")}
                </a>
              </div>
            </div>

            <aside className="city-promo-card">
              <div className="city-promo-form-wrap">
                <CityLeadForm cityName={page.cityName} />
              </div>
            </aside>
          </div>

          <div className="city-proof-row">
            {proofStats.map((stat) => (
              <article key={stat.label} className={`city-proof-card city-proof-${stat.icon}`}>
                <span className="city-proof-icon">
                  <ProofIcon type={stat.icon} />
                </span>
                <div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {page.heroDescription ? (
        <section className="city-intro">
          <div className="city-intro-inner">
            <p>{page.heroDescription}</p>
            <a href={siteWhatsAppUrl} className="city-whatsapp-link" target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
          </div>
        </section>
      ) : null}

      {contentHtml ? (
        <section className="city-content">
          <div className="city-content-inner">
            <div className="city-content-html" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        </section>
      ) : null}

      <AllCoursesSection courses={courses} />
      <CityWhyLearnSection cityName={page.cityName} />
      <TutorsSection />
      <ComparisonSection />
      <CertificateSection />
      <VideoTestimonialsSection testimonials={videoTestimonials} />
      <CitySuccessBanner cityName={page.cityName} />

      <section className="city-cta">
        <div className="city-cta-inner">
          <h3>{page.ctaHeading}</h3>
          <p>{page.ctaText}</p>
          <Link href="/contact" className="btn btn-primary">
            {page.ctaButtonText || "Book Free Demo"}
          </Link>
        </div>
      </section>
    </>
  );
}
