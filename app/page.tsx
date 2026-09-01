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

function SmartLearningSection() {
  return (
    <section className="smart-learning-section">
      <div className="smart-learning-container">
        <div style={{ flex: '1 1 400px' }}>
          <h2 className="smart-learning-title">
            The Smartest Way to Learn a New Language
          </h2>
        </div>
        <div className="smart-learning-list">

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0b2471" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.15rem 0' }}>Small group classes for personalised attention</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>Take group classes with up to 8-10 other students or learn 1-on-1 with your teacher</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0b2471" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.15rem 0' }}>9K+ live classes per year</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>Receive tailored feedback from your expert tutors after every lesson</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0b2471" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.15rem 0' }}>Learn to speak real-life language</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>Build confidence to engage in everyday conversations</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function ExamPrepSection() {
  return (
    <section className="exam-prep-section">
      <div className="exam-prep-container">
        <div className="exam-prep-content">
          <h2 style={{ fontSize: '2.4rem', fontWeight: 'bold', color: '#0b2471', lineHeight: '1.15', margin: '0 0 0.25rem 0' }}>
            Prepare for Goethe Exam with Certified German Tutors!
          </h2>
          <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>
            Struggling to grasp German grammar and conversation? Let German-Skill guide you to fluent German.
          </p>
          <div style={{ marginTop: '0.25rem' }}>
            <Link href="/contact" style={{ display: 'inline-block', backgroundColor: '#001a72', color: '#fff', padding: '0.85rem 2.5rem', borderRadius: '4px', fontWeight: '600', textDecoration: 'none', letterSpacing: '0.5px' }}>
              BOOK A DEMO
            </Link>
          </div>
        </div>
        <div className="exam-prep-image-wrap">
          <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <Image
              src="/hero-students.jpg"
              alt="Student preparing for exam"
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </div>
          {/* Badges */}
          <div className="exam-prep-badges" style={{ position: 'absolute', top: '10%', right: '-1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 10 }}>
            <div style={{ backgroundColor: '#fff', padding: '0.5rem 1.2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '0.85rem', fontWeight: '700', color: '#0b2471' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              CERTIFIED TUTOR
            </div>
            <div style={{ backgroundColor: '#fff', padding: '0.5rem 1.2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '0.85rem', fontWeight: '700', color: '#0b2471', transform: 'translateX(-20px)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              GOETHE FOCUSED
            </div>
            <div style={{ backgroundColor: '#fff', padding: '0.5rem 1.2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '0.85rem', fontWeight: '700', color: '#0b2471' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              PROVEN RESULTS
            </div>
          </div>
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
