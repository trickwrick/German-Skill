import React from "react";

export default function SmartLearningSection({ isCourseDetails = false }: { isCourseDetails?: boolean }) {
  return (
    <section className="smart-learning-section" style={{ backgroundColor: isCourseDetails ? '#f6f8fb' : 'transparent' }}>
      <div className="smart-learning-container">
        <div style={{ flex: '1 1 400px' }}>
          <h2 className="smart-learning-title">
            The Smartest Way to Learn a New Language
          </h2>
        </div>
        <div className="smart-learning-list">

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary-600)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.15rem 0' }}>Small group classes for personalised attention</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>Take group classes with up to 8-10 other students or learn 1-on-1 with your teacher</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary-600)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.15rem 0' }}>9K+ live classes per year</h3>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>Receive tailored feedback from your expert tutors after every lesson</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary-600)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="9 12 11 14 15 10"></polyline></svg>
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