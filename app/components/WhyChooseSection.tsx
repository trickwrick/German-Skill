import React from "react";
import Image from "next/image";

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

export default function WhyChooseSection() {
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