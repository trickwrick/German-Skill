"use client";

import React from 'react';

const programs = [
  {
    title: '12th Pass Students',
    desc: 'Guidance for students after 12th to start their higher education and prepare for career opportunities in Germany.',
    icon: '🎓'
  },
  {
    title: 'Bachelors & Masters',
    desc: 'Complete guidance for graduates seeking admission into top-ranked German public universities.',
    icon: '🏛️'
  },
  {
    title: 'Healthcare Professionals',
    desc: 'Specialized language training and placement support for nurses and doctors seeking careers in the German healthcare system.',
    icon: '⚕️'
  },
  {
    title: 'IT & Engineering',
    desc: 'Advanced career guidance and direct employer connections for technical professionals and engineers.',
    icon: '💻'
  },
  {
    title: 'Working Professionals',
    desc: 'Comprehensive support for skilled workers applying for the German Opportunity Card and job seeker visas.',
    icon: '💼'
  }
];

const steps = [
  { id: 1, title: 'German Language Training', desc: 'Intensive German language training (A1 to B2/C1) required for study or jobs in Germany.' },
  { id: 2, title: 'Profile Preparation', desc: 'Professional resume creation and verification of your academic and professional documents.' },
  { id: 3, title: 'Application & Interviews', desc: 'Assistance with university applications or scheduling interviews with German employers.' },
  { id: 4, title: 'Visa & Documentation', desc: 'Complete end-to-end assistance for visa processing, blocked accounts, and relocation formalities.' },
  { id: 5, title: 'Arrival in Germany', desc: 'Start your exciting new educational or professional journey in Germany.' }
];

export default function GermanProgramsSection() {
  return (
    <section style={{ backgroundColor: '#ffffff', padding: '5rem 1rem', color: '#111827', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', border: '1px solid rgba(227, 30, 36, 0.2)', marginBottom: '1rem', background: 'rgba(227, 30, 36, 0.05)' }}>
             <span style={{ color: 'var(--primary-600, #e31e24)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>🇩🇪 STUDY & WORK IN GERMANY</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: '800', marginBottom: '1rem', marginTop: 0, lineHeight: 1.2, color: '#111827' }}>
            German Placement <span style={{ color: 'var(--primary-600, #e31e24)' }}>Programs</span>
          </h2>
          <p style={{ color: '#4b5563', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Opportunities for students and skilled professionals with expert German language training and complete placement support for Germany.
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginBottom: '6rem' }}>
          {programs.map((prog, idx) => (
            <div key={idx} style={{ 
              background: '#ffffff', 
              border: '1px solid rgba(0,0,0,0.08)', 
              borderRadius: '16px', 
              padding: '2.5rem 2rem', 
              width: 'calc(33.333% - 1rem)', 
              minWidth: '300px',
              maxWidth: '360px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = 'translateY(-8px)'; 
              e.currentTarget.style.borderColor = 'rgba(227, 30, 36, 0.4)'; // --primary-600
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(227, 30, 36, 0.12)'; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.transform = 'none'; 
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; 
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            >
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #e31e24 0%, #ffc20e 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', 
                marginBottom: '1.5rem', boxShadow: '0 8px 20px rgba(227, 30, 36, 0.2)'
              }}>
                {prog.icon}
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#111827' }}>{prog.title}</h3>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>{prog.desc}</p>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div style={{ textAlign: 'center', background: '#f8fafc', padding: '3rem 2rem 4rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '4rem', color: '#111827' }}>
            Our <span style={{ color: 'var(--primary-600, #e31e24)' }}>5-Step</span> Placement Process
          </h3>
          
          <div className="process-container" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'nowrap' }}>
            {/* Background Line */}
            <div className="process-line-bg" style={{ position: 'absolute', top: '28px', left: '10%', right: '10%', height: '2px', background: 'rgba(0,0,0,0.1)', zIndex: 0 }}>
               {/* Animated Progress Line overlay */}
               <div className="process-line-progress" style={{ height: '100%', background: 'var(--primary-600, #e31e24)', width: '0%' }}></div>
            </div>
            
            {steps.map((step, idx) => (
              <div key={idx} className="process-step-item" style={{ position: 'relative', zIndex: 1, flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 10px' }}>
                <div 
                  className="blink-node"
                  style={{ 
                  width: '56px', height: '56px', borderRadius: '50%', 
                  background: 'var(--primary-600, #e31e24)', color: '#fff', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem',
                  boxShadow: '0 0 0 0 rgba(227, 30, 36, 0.7)',
                  border: '4px solid #f8fafc'
                }}>
                  {step.id}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: '#111827' }}>{step.title}</h4>
                <p style={{ color: '#4b5563', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(227, 30, 36, 0.5); }
          70% { box-shadow: 0 0 0 15px rgba(227, 30, 36, 0); }
          100% { box-shadow: 0 0 0 0 rgba(227, 30, 36, 0); }
        }
        
        @keyframes progress-fill {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }

        .blink-node {
          animation: pulse-glow 2s infinite;
        }

        .process-line-progress {
          animation: progress-fill 5s ease-in-out infinite;
        }

        @media (max-width: 900px) {
          .process-container {
            flex-direction: column !important;
            align-items: center !important;
            gap: 3rem;
          }
          .process-line-bg {
            display: none !important;
          }
          .process-step-item {
            width: 100%;
            max-width: 300px;
          }
        }
      `}} />
    </section>
  );
}
