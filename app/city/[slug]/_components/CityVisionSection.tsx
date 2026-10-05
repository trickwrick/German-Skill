import React from "react";
import Link from "next/link";
import type { CityVisionSectionData } from "../../../../data/cityPages";
import CityRichHtml from "./CityRichHtml";

type CityVisionSectionProps = {
  cityName: string;
  data: CityVisionSectionData;
};

export default function CityVisionSection({ cityName, data }: CityVisionSectionProps) {
  const highlight = data.headingHighlight?.trim() || cityName;

  return (
    <section className="city-vision-mission" style={{ padding: '4rem 1rem', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* Left: Our Vision (White) */}
        <div style={{ flex: '1 1 300px', background: '#ffffff', borderRadius: '12px', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
            Our Vision
          </h3>
          <div style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
            {data.text ? (
              <CityRichHtml html={data.text} />
            ) : (
              <p>To create a dynamic community of socially minded individuals committed to driving positive change and addressing educational and career challenges.</p>
            )}
          </div>
        </div>

        {/* Middle: About Fluent AUF (Red) */}
        <div style={{ flex: '1.2 1 340px', background: 'var(--primary-600, #d32f2f)', color: '#ffffff', borderRadius: '12px', padding: '3rem 2.5rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(211,47,47,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.25rem', color: '#ffffff' }}>
            {data.heading ? (
              <>
                {data.heading} <span style={{ color: 'var(--gold-500, #ffd54f)' }}>{highlight}</span>
                {data.headingSuffix ? ` ${data.headingSuffix}` : ""}
              </>
            ) : (
              `About Fluent AUF ${cityName}`
            )}
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem', opacity: 0.95 }}>
            Welcome to Fluent AUF — your gateway to impactful German language learning and placement. We connect ambitious learners to create and lead meaningful careers in Germany and beyond. Join our trusted platform and transform your passion into tangible success.
          </p>
          <Link href={data.linkHref || "/contact"} className="vision-mission-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 24px', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '6px', color: '#fff', fontSize: '0.95rem', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s' }}>
            {data.linkText || "Read More"} &rarr;
          </Link>
        </div>

        {/* Right: Our Mission (White) */}
        <div style={{ flex: '1 1 300px', background: '#ffffff', borderRadius: '12px', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
            Our Mission
          </h3>
          <div style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
            {data.points && data.points.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.points.map((point, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}><CityRichHtml html={point} /></li>
                ))}
              </ul>
            ) : (
              <p>To support and nurture student-led ventures through mentorship, opportunities, and resources, fostering innovation and sustainable impact in global careers.</p>
            )}
          </div>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .vision-mission-btn:hover {
          background: rgba(255,255,255,0.1) !important;
        }
      `}} />
    </section>
  );
}
