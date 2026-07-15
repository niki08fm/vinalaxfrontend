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
 <div 
  className="logo-container" 
  onClick={() => navigate('/')} 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    background: '#ffffff',       // Creates a crisp white background card so the logo pops beautifully
    borderRadius: '6px',         // Smooths out the edges of the logo background block
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Adds a slight drop shadow depth effect
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'scale(1.03)';
    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  }}
>
  <img 
    src="/vinlaxweblogo.jpeg" 
    alt="Vinalax HR Solutions LLP" 
    style={{ 
      height: '75px',            // Significantly increased from 55px to make text big and highly legible
      width: 'auto',             // Maintains perfect proportions without stretching
      objectFit: 'contain',
      display: 'block'
    }} 
  />
</div> 
      
      <ul className={`nav-links ${isMobileOpen ? 'mobile-open' : ''}`}>
        <li><a onClick={() => handleNavClick('about')}>About</a></li>
        <li><a onClick={() => handleNavClick('services')}>Services</a></li>
        <li><a onClick={() => handleNavClick('why')}>Why Us</a></li>
        <li><a onClick={() => handleNavClick('industries')}>Industries</a></li>
        <li><a onClick={() => handleNavClick('process')}>Process</a></li>
        <li><a onClick={() => { setIsMobileOpen(false); navigate('/portal/login'); }}>Client Login</a></li>
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