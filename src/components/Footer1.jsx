import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-logo">Vinalax <span>HR Solutions</span> LLP</div>
          <div className="footer-tagline">People. Processes. Compliance. We Simplify It All.</div>
          <div className="footer-tagline">Your Trusted Partner in HR Compliance & Payroll</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div className="footer-copy">© 2026 · Vinalax HR Solutions LLP</div>
          <span 
            onClick={() => navigate('/login')} 
            style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Admin Portal
          </span>
        </div>
      </div>
    </footer>
  );
}