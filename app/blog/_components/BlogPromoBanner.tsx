import React from 'react';
import Link from 'next/link';

export default function BlogPromoBanner() {
  return (
    <aside style={{
      background: 'var(--gradient-stats, linear-gradient(90deg, #1a1a1a 0%, #e31e24 42%, #ffc20e 100%))',
      borderRadius: '12px',
      padding: '2.5rem 3rem',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '2rem',
      marginTop: '3rem',
      marginBottom: '3rem',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 10px 30px -10px rgba(227, 30, 36, 0.3)'
    }}>
      <header style={{ flex: '1 1 0%', minWidth: '300px', color: '#ffffff' }}>
        <h3 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '0.75rem', marginTop: 0, color: '#ffffff' }}>
          Lost for Words? We&apos;ve Got You!
        </h3>
        <p style={{ fontSize: '1.15rem', margin: 0, lineHeight: '1.5', color: '#ffffff' }}>
          Sign up for our courses and let our expert teachers boost your vocabulary effortlessly!
        </p>
      </header>
      <nav>
        <Link href="/contact" style={{
          display: 'inline-block',
          backgroundColor: 'white',
          color: '#e31e24',
          padding: '1rem 2.5rem',
          borderRadius: '8px',
          fontWeight: '700',
          textDecoration: 'none',
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'
        }}>
          BOOK A DEMO
        </Link>
      </nav>
    </aside>
  );
}
