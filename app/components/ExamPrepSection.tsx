import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function ExamPrepSection({ isCourseDetails }: { isCourseDetails?: boolean }) {
  return (
    <section className="exam-prep-section" style={isCourseDetails ? { background: '#ffffff' } : {}}>
      <div className="exam-prep-container">
        <div className="exam-prep-content">
          <h2 style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1.15', margin: '0 0 0.25rem 0' }}>
            Prepare for Goethe Exam with Certified German Tutors!
          </h2>
          <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.4', margin: '0' }}>
            Struggling to grasp German grammar and conversation? Let German-Skill guide you to fluent German.
          </p>
          <div style={{ marginTop: '0.25rem' }}>
            <Link href="/contact" className="btn btn-primary" style={{ display: 'inline-block', padding: '0.85rem 2.5rem', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', letterSpacing: '0.5px' }}>
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
            <div style={{ backgroundColor: '#fff', padding: '0.5rem 1.2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-600)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              CERTIFIED TUTOR
            </div>
            <div style={{ backgroundColor: '#fff', padding: '0.5rem 1.2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-600)', transform: 'translateX(-20px)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              GOETHE FOCUSED
            </div>
            <div style={{ backgroundColor: '#fff', padding: '0.5rem 1.2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-600)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              PROVEN RESULTS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}