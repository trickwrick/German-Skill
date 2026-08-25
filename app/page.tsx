import type { Metadata } from "next";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import AllCoursesSection from "./components/AllCoursesSection";
import HeroSection from "./components/HeroSection";
import ComparisonSection from "./components/ComparisonSection";
import CertificateSection from "./components/CertificateSection";
import JsonLd from "./components/JsonLd";
import Navbar from "./components/Navbar";
import SiteFooter from "./components/SiteFooter";
import TutorsSection from "./components/TutorsSection";
import type { HomeFaqContent } from "../data/homeFaqs";
import type { VideoTestimonial } from "../data/videoTestimonials";
import { getGermanCoursesForDisplay } from "../lib/courseContentStore";
import { getGermanLanguageCoursePageContent } from "../lib/generalPageStore";
import { getActiveHomeFaqItems } from "../lib/homeFaqStore";
import { getVideoTestimonials } from "../lib/videoTestimonialStore";
import { getSeoSettings } from "../lib/seoStore";
import { buildFaqSchema, buildPageMetadata, buildWebPageSchema } from "../lib/siteSeo";
import { PUBLIC_REVALIDATE_SECONDS } from "../lib/publicDataCache";

const TestimonialsSection = dynamic(() => {
  // @ts-expect-error Next.js resolves the TSX module without a .js extension.
  return import("./components/TestimonialsSection");
});
const VideoTestimonialsSection = dynamic(() => {
  // @ts-expect-error Next.js resolves the TSX module without a .js extension.
  return import("./components/VideoTestimonialsSection");
}) as ComponentType<{ testimonials: VideoTestimonial[] }>;
const HomeFaqSection = dynamic(() => {
  // @ts-expect-error Next.js resolves the TSX module without a .js extension.
  return import("./components/HomeFaqSection");
}) as ComponentType<{ content: HomeFaqContent }>;

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSeoSettings();

  return buildPageMetadata({
    title: settings.title,
    description: settings.description,
    path: "/",
    keywords: settings.keywords,
  });
}

const stats = [
  { value: "10,500+", label: "Happy Students" },
  { value: "2,100+", label: "Batches Successfully Completed" },
  { value: "21+", label: "Certified Trainers" },
];

function StatsBanner() {
  return (
    <section className="stats-banner-section">
      <div className="stats-banner">
        <div className="stats-banner-copy">
          <span className="stats-tag">Facts</span>
          <h2>Our Numbers</h2>
        </div>
        <div className="stats-banner-grid">
          {stats.map((item) => (
            <div key={item.label} className="stats-banner-item">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const portalFeatures = [
  { icon: "📈", label: "Track Your Learning Progress" },
  { icon: "🔔", label: "Stay Notified Instantly" },
  { icon: "💻", label: "Join online classes using the link" },
  { icon: "💡", label: "Share Valuable Feedback" },
  { icon: "▶️", label: "Access recorded videos" },
  { icon: "📅", label: "Upcoming Batches & Demo Sessions" },
];

const whyChooseItems = [
  {
    label: "Crack Goethe/TELC with Confidence",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 8h8M8 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M14 16h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="17" cy="17" r="3" fill="#ef4444" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Track Your Progress",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="5.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14.5 14.5L20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 12v3M10 9v6M13 11v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Study, Work & Settle Abroad",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 13h16M12 6a9 9 0 019 7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 4l3-2 3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Boost Your Career Profile",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="10" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 10V8a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="18" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="18" cy="12" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Higher Earning Potential",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 18l2-8 2 4 2-6 2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 5l1.2 2.4L16 8l-2.2 1.2L12 11.5 10.2 9.2 8 8l2.8-.6L12 5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Personal Growth",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 20v-2a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16 10l3-2M16 14l4 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

function WhyChooseSection() {
  return (
    <section className="why-choose-section">
      <div className="why-choose-inner">
        <div className="why-choose-header">
          <span className="why-choose-tag">Advantages</span>
          <h2>Why Learn German With Us?</h2>
          <p>
            Being the official language of many countries, learning German will expand your
            worldview, career options, and connections globally.
          </p>
        </div>

        <div className="why-choose-grid">
          {whyChooseItems.map((item) => (
            <div key={item.label} className="why-choose-item">
              <div className="why-choose-icon" aria-hidden="true">
                {item.icon}
              </div>
              <span className="why-choose-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentPortalSection() {
  return (
    <section className="portal-section">
      <div className="portal-inner">
        <div className="portal-visual">
          <div className="portal-image-wrap">
            <Image
              src="/portal-education.jpg"
              alt="Students using digital learning platform in classroom"
              title="Students using digital learning platform in classroom"
              width={520}
              height={340}
              className="portal-image"
            />
          </div>
          <p className="portal-caption">
            Delivering Quality Education backed by World-class Digital Infrastructure
          </p>
        </div>

        <div className="portal-content">
          <span className="portal-tag">Student Portal</span>
          <h2>Language Learning Made Simple</h2>
          <p className="portal-subtitle">
            Discover Tools and Resources for Success in Your Language Journey
          </p>
          <div className="portal-features">
            {portalFeatures.map((item) => (
              <div key={item.label} className="portal-feature">
                <span className="portal-feature-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WebinarSection() {
  return (
    <section className="webinar-section">
      <div className="webinar-banner">
        <div className="webinar-image-wrap">
          <Image
            src="/webinar-student.jpg"
            alt="Student attending online webinar on tablet"
            title="Student attending online webinar on tablet"
            width={160}
            height={160}
            className="webinar-image"
          />
        </div>
        <div className="webinar-copy">
          <h2>
            Explore our <span>Free Webinars</span>
          </h2>
          <p>
            Explore a variety of topics and enhance your language skills with our expert-led
            webinars.
          </p>
        </div>
        <Link href="/contact" className="btn btn-webinar">
          Join Free Webinars
        </Link>
      </div>
    </section>
  );
}

function CareersSection() {
  return (
    <section className="careers-section">
      <div className="careers-inner">
        <article className="careers-card">
          <h2 className="careers-card-heading">Learn with 16000+ Students Across the Globe!</h2>
          <Link href="/about/apply-job" className="btn btn-careers">
            Know More
          </Link>
        </article>
      </div>
    </section>
  );
}

function PromoCards() {
  return (
    <section className="promo-section" id="batches">
      <div className="promo-section-inner">
        <article className="promo-card promo-card-batches">
          <div className="enroll-badge" aria-hidden="true">
            <span className="enroll-badge-label">New Batches</span>
            <div className="enroll-banner">
              <span className="enroll-top">ENROLL</span>
              <span className="enroll-bottom">NOW</span>
            </div>
          </div>
          <div className="promo-card-body">
            <h2>
              Explore <span>Upcoming Batches</span>
            </h2>
            <Link href="/contact" className="btn btn-schedule">
              View Schedule
            </Link>
          </div>
        </article>

        <article className="promo-card promo-card-offers">
          <div className="offer-ribbon" aria-hidden="true">
            <span>UPTO</span>
            <strong>15% OFF</strong>
          </div>
          <div className="promo-card-body promo-card-body-center">
            <h2>Upto 15% OFF</h2>
            <p>
              Explore our exclusive deals and start your language learning journey today!
            </p>
            <Link href="/contact" className="promo-link">
              View Offers &gt;&gt;
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [courses, videoTestimonials, homeFaqs, seoSettings, coursesPage] = await Promise.all([
    getGermanCoursesForDisplay(),
    getVideoTestimonials(),
    getActiveHomeFaqItems(),
    getSeoSettings(),
    getGermanLanguageCoursePageContent(),
  ]);

  const homeSchema = [
    buildWebPageSchema({
      name: seoSettings.title,
      description: seoSettings.description,
      path: "/",
    }),
    buildFaqSchema(
      homeFaqs.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    ),
  ];

  return (
    <>
      <JsonLd data={homeSchema} />
      <Navbar />
      <main>
        <HeroSection />
        <PromoCards />
        <AllCoursesSection
          courses={courses}
          title={coursesPage.sectionTitle}
          description={coursesPage.sectionDescription}
        />
        <StatsBanner />
        <TutorsSection />
        <StudentPortalSection />
        <WhyChooseSection />
        <ComparisonSection />
        <CertificateSection />
        <VideoTestimonialsSection testimonials={videoTestimonials} />
        <TestimonialsSection />
        <WebinarSection />
        <HomeFaqSection content={homeFaqs} />
        <CareersSection />
    </main>
      <SiteFooter />
    </>
  );
}
