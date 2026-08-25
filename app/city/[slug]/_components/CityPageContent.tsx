import Link from "next/link";
import type { CityPage } from "../../../../data/cityPages";
import {
  DEFAULT_HERO_BADGE_PREFIX,
  defaultHeroTypedPhrases,
} from "../../../../data/cityPages";
import type { GermanCourse } from "../../../../data/germanCourses";
import type { HomeFaqContent } from "../../../../data/homeFaqs";
import type { VideoTestimonial } from "../../../../data/videoTestimonials";
import { sanitizeBlogHtml } from "../../../../lib/blogHtmlUtils";
import AllCoursesSection from "../../../components/AllCoursesSection";
import CertificateSection from "../../../components/CertificateSection";
import ComparisonSection from "../../../components/ComparisonSection";
import HomeFaqSection from "../../../components/HomeFaqSection";
import TutorsSection from "../../../components/TutorsSection";
import VideoTestimonialsSection from "../../../components/VideoTestimonialsSection";
import CityJourneyCta from "./CityJourneyCta";
import CityLeadForm from "./CityLeadForm";
import CitySuccessBanner from "./CitySuccessBanner";
import CityTypedHighlight from "./CityTypedHighlight";
import CityRichHtml from "./CityRichHtml";
import CityVisionSection from "./CityVisionSection";
import CityWhyLearnSection from "./CityWhyLearnSection";

type CityPageContentProps = {
  page: CityPage;
  courses: GermanCourse[];
  videoTestimonials: VideoTestimonial[];
  homeFaqs: HomeFaqContent;
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

function getHeroBadgePrefix(subtitle: string) {
  const trimmed = subtitle?.trim() || DEFAULT_HERO_BADGE_PREFIX.trim();
  if (/German Communication\s*$/i.test(trimmed)) {
    return DEFAULT_HERO_BADGE_PREFIX;
  }
  return trimmed.endsWith(" ") ? trimmed : `${trimmed} `;
}

export default function CityPageContent({
  page,
  courses,
  videoTestimonials,
  homeFaqs,
}: CityPageContentProps) {
  const contentHtml = sanitizeBlogHtml(page.contentHtml);
  const badgePrefix = getHeroBadgePrefix(page.subtitle || DEFAULT_HERO_BADGE_PREFIX);
  const typedPhrases =
    Array.isArray(page.heroTypedPhrases) && page.heroTypedPhrases.length
      ? page.heroTypedPhrases
      : defaultHeroTypedPhrases();

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
              <p className="city-top-subtitle">
                <CityTypedHighlight prefix={badgePrefix} texts={typedPhrases} />
              </p>
              {page.heroDescription?.trim() ? (
                <CityRichHtml html={page.heroDescription} className="city-top-lead" />
              ) : null}

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

      {contentHtml ? (
        <section className="city-content">
          <div className="city-content-inner">
            <div className="city-content-html" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        </section>
      ) : null}

      <AllCoursesSection courses={courses} />
      <TutorsSection />
      <CityVisionSection cityName={page.cityName} data={page.vision} />
      <ComparisonSection />
      <CertificateSection />
      <CityWhyLearnSection cityName={page.cityName} data={page.whyLearn} />
      <CityJourneyCta data={page.journey} />
      <VideoTestimonialsSection testimonials={videoTestimonials} />
      <CitySuccessBanner cityName={page.cityName} data={page.success} />
      <HomeFaqSection
        content={{
          title: page.faqs.title || homeFaqs.title,
          subtitle: page.faqs.subtitle || homeFaqs.subtitle,
          items:
            Array.isArray(page.faqs?.items) && page.faqs.items.length > 0
              ? page.faqs.items.map((item, index) => ({
                  id: item.id || `city-faq-${index + 1}`,
                  question: item.question,
                  answer: item.answer,
                  sortOrder: index + 1,
                  isActive: true,
                }))
              : homeFaqs.items,
        }}
      />
    </>
  );
}
