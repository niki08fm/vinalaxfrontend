import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (targetId) => {
    setIsMobileOpen(false);
    
    // If we're not on the home page, redirect home first then scroll
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: targetId } });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav>
    
      {/* {<div style={{ cursor: 'pointer' }} onClick={() => handleNavClick('hero')} className="nav-logo">
        <div className="nav-logo-icon">V</div>
        <div className="nav-logo-text">
          Vinalax HR Solutions LLP
          <span>People.Process.Compliance.We Simplify It All</span>
        </div>
      </div> } */}
      
      {/* ── LIVE FULL WIDTH BRAND LOGO ── */}
{/* ── EXPANDED FULL WIDTH BRAND LOGO ──
 */}
 <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem' }} onClick={() => handleNavClick('hero')} className="nav-logo">
  
  {/* The new direct circular VHR image asset */}
  <img 
    src="/VHR_LogoCircle_Transparent.png" 
    alt="Vinalax HR Logo"
    style={{
      width: '46px',
      height: '46px',
      borderRadius: '50%', // Ensures a perfect circular profile edge
      objectFit: 'cover',
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    }}
  />

  {/* Your clean text branding layout preserved exactly */}
  <div className="nav-logo-text">
    Vinalax HR Solutions LLP
    <span>People.Process.Compliance.We Simplify It All</span>
  </div>

</div>
      
      <ul className={`nav-links ${isMobileOpen ? 'mobile-open' : ''}`}>
        <li><a onClick={() => handleNavClick('about')}>About</a></li>
        <li><a onClick={() => handleNavClick('services')}>Services</a></li>
        <li><a onClick={() => handleNavClick('why')}>Why Us</a></li>
        <li><a onClick={() => handleNavClick('industries')}>Industries</a></li>
        <li><a onClick={() => handleNavClick('process')}>Process</a></li>
        <li><a onClick={() => handleNavClick('contact')} className="nav-cta">Get In Touch</a></li>
      </ul>

      <div className="hamburger" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}