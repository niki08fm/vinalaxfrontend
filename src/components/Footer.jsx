import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#0d1b2a', // Deep corporate luxury navy background
      color: '#ffffff',
      padding: '4rem 5% 2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderTop: '1px solid rgba(224, 169, 109, 0.15)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingBottom: '3rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Left Segment: Brand Identity Only */}
        <div>
          <h3 style={{ 
            fontFamily: 'Cormorant Garamond, serif', 
            fontSize: '1.6rem', 
            fontWeight: '600', 
            color: '#e0a96d', 
            marginBottom: '0.75rem',
            letterSpacing: '0.03em'
          }}>
            Vinalax HR Solutions LLP
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
            People. Processes. Compliance. We Simplify It All.<br />
            Your Trusted Partner in HR Compliance & Payroll.
          </p>
        </div>
      </div>

      {/* Bottom Segment: Clean Copyright Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '1.5rem auto 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.45)'
      }}>
        <p style={{ margin: 0 }}>© {currentYear} Vinalax HR Solutions LLP. All rights reserved.</p>
      </div>
    </footer>
  );
}