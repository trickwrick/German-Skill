import type { Metadata } from "next";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import SmartLearningSection from "./components/SmartLearningSection";
import ExamPrepSection from "./components/ExamPrepSection";
import WhyChooseSection from "./components/WhyChooseSection";

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
            Take the Next Step in <span>Your German Journey!</span>
          </h2>
          <p>
            Join FluentAuf and learn German with expert teachers, flexible courses, and practical learning resources.
          </p>
        </div>
        <Link href="/contact" className="btn btn-webinar">
          BOOK A DEMO
        </Link>
      </div>
    </section>
  );
}

function CareersSection() {
  return (
    <section className="careers-section" style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '6px 16px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '1.5rem' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </div>
        <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>The Leader in Online Learning</span>
      </div>
      <h2 style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '700', marginBottom: '1.5rem', maxWidth: '800px', lineHeight: '1.2' }}>
        Join more than 1 million<br />learners worldwide
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '700px', lineHeight: '1.6' }}>
        Effective learning starts with assessment. Learning a new skill is hard work—Signal makes it easier.
      </p>
    </section>
  );
}

function FeaturesBanner() {
  return (
    <section style={{ backgroundColor: 'var(--primary-50, #fef2f2)', padding: '3rem 1rem' }}>
      <div className="features-banner-grid" style={{ backgroundColor: '#fff', color: '#000', borderRadius: '12px', padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <div className="features-icon-wrapper" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-100, #fee2e2)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-600, #e31e24)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
          </div>
          <strong style={{ fontSize: '0.95rem', fontWeight: '500', color: '#111827' }}>90% Student Success Rate</strong>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <div className="features-icon-wrapper" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-100, #fee2e2)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-600, #e31e24)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          </div>
          <strong style={{ fontSize: '0.95rem', fontWeight: '500', color: '#111827' }}>Global German Education</strong>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <div className="features-icon-wrapper" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-100, #fee2e2)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-600, #e31e24)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
          <strong style={{ fontSize: '0.95rem', fontWeight: '500', color: '#111827' }}>Goethe & Telc Examination</strong>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <div className="features-icon-wrapper" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-100, #fee2e2)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-600, #e31e24)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <strong style={{ fontSize: '0.95rem', fontWeight: '500', color: '#111827' }}>Skilled Goethe Certified Tutors</strong>
        </div>
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
        <FeaturesBanner />
        <AllCoursesSection
          courses={courses}
          title={coursesPage.sectionTitle}
          description={coursesPage.sectionDescription}
        />
        <StatsBanner />
        <VideoTestimonialsSection testimonials={videoTestimonials} />
        <TestimonialsSection />
        <TutorsSection />
        <SmartLearningSection />

        <ExamPrepSection />
        <WhyChooseSection />
        <ComparisonSection />
        <CertificateSection />
        <WebinarSection />
        <HomeFaqSection content={homeFaqs} />
        <CareersSection />
      </main>
      <SiteFooter />
    </>
  );
}
