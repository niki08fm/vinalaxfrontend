import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const SERVICE_DATA = {
  'hr-solutions': {
    title: 'HR Solutions & Documentation',
    icon: '📄',
    description: 'Complete employee lifecycle management from hiring documentation through to full & final settlements. We handle the paperwork so you can focus on core business scaling.',
    deliverables: [
      'Customized Offer & Appointment Letters matching legal standards.',
      'Comprehensive Employee Onboarding Documentation kits.',
      'Structured HR File & Records Management systems.',
      'Official Confirmation & Probation Review processing.'
    ]
  },
  'payroll-management': {
    title: 'Payroll Management Outsourcing',
    icon: '💰',
    description: 'Accurate, timely salary processing with full integration of attendance tracking, leave management, bonuses, incentives, and statutory deductions.',
    deliverables: [
      'End-to-End monthly salary sheet processing.',
      'Automated itemized payslip generation and distribution.',
      'Attendance and leave module integrations.',
      'Full & Final (F&F) structural settlement evaluations.'
    ]
  },
  'statutory-compliance': {
    title: 'Statutory Compliance (PF/ESI)',
    icon: '⚖️',
    description: 'Stay fully compliant with all labor laws, central acts, and statutory obligations. We handle monthly filings to shield your business from unexpected notices.',
    deliverables: [
      'Provident Fund (PF) & Employee State Insurance (ESI) management.',
      'Professional Tax (PT) calculations and localized compliance filings.',
      'On-time calculation and filing of monthly & annual statutory returns.',
      'Proactive Labor Law Advisory and audit preparation.'
    ]
  },
  'licences-registrations': {
    title: 'Licences & Statutory Registrations',
    icon: '🏗️',
    description: 'We manage and acquire all essential corporate state registrations and operating licenses your industry demands to remain strictly functional.',
    deliverables: [
      'Shop & Establishment Act registrations.',
      'Building and Other Construction Workers (BOCW) enrollment acts.',
      'Contract Labour Regulation and Abolition Act (CLRA) compliance licenses.',
      'Independent sub-contractor and vendor validation checks.'
    ]
  },
  'employee-lifecycle': {
    title: 'Employee Lifecycle Management',
    icon: '🔄',
    description: 'Seamless professional management from day-one onboarding tasks up to clear separation exits. Every transition is supported with detailed paperwork records.',
    deliverables: [
      'Structured company orientation workflows.',
      'Leave tracking, holiday calendars, and shift management rosters.',
      'Formal resignation acceptance tracking loops.',
      'Expedited delivery of Relieving and Experience Certification letters.'
    ]
  },
  'hr-advisory': {
    title: 'HR Advisory & Strategy Consulting',
    icon: '📊',
    description: 'Expert consultation on scaling policies, tax-optimized salary components, legal risk assessments, and workforce governance best practices tailored to your operating scale.',
    deliverables: [
      'Drafting customized Company HR Policies and Employee Handbooks.',
      'Tax-efficient salary structures (CTC restructuring blocks).',
      'Strategic labor risk audit mappings.',
      'Growth scalability plans for teams expanding from 5 to 500+.'
    ]
  }
};

export default function ServiceDetails() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = SERVICE_DATA[serviceId];

  const [formData, setFormData] = useState({ fname: '', lname: '', company: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!service) {
      navigate('/');
    }
    window.scrollTo(0, 0);
  }, [serviceId, service, navigate]);

  if (!service) return null;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // ── LIVE SERVER ROUTING IMPLEMENTATION ──
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fname || !formData.phone) {
      alert('Please populate Name and Phone variables to confirm.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname: formData.fname,
          lname: formData.lname,
          company: formData.company,
          phone: formData.phone,
          service: service.title, // Sends the correct matched title block to the database mapping
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
      } else {
        alert('Server Error: ' + (data.error || 'Failed to register vertical inquiry.'));
      }
    } catch (error) {
      console.error('Service Submission Network Error:', error);
      alert('Cannot connect to back-end API. Please check if server.js is active on port 5000.');
    }
  };

  return (
    <>
      <Navbar />

      <section style={{ background: 'var(--navy)', minHeight: '40vh', paddingTop: '9rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div className="hero-badge" style={{ marginBottom: '1rem' }}>Service Vertical Insights</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--white)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '600' }}>
          {service.icon} {service.title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '700px', margin: '1.5rem auto 0', fontSize: '1.05rem', lineHeight: '1.7', fontWeight: '300' }}>
          {service.description}
        </p>
      </section>

      <section style={{ background: 'var(--light)', padding: '5rem 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', maxWidth: '1200px', margin: '0 auto', alignItems: 'start' }}>
          
          <div className="about-left">
            <p className="section-label">Core Capabilities</p>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>What We Manage</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '2rem' }}>
              Vinalax delivers process-driven execution routines built onto reliable frameworks. Our operational loops ensure your staff administration pipeline stays highly disciplined.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {service.deliverables.map((item, idx) => (
                <div key={idx} style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--cream2)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>✓</span>
                  <div>
                    <h4 style={{ color: 'var(--navy)', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.25rem' }}>Operational Component {idx + 1}</h4>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-outline" onClick={() => navigate('/')} style={{ marginTop: '2.5rem', color: 'var(--navy)', borderColor: 'var(--navy)', background: 'transparent', cursor: 'pointer' }}>
              ← Back to Main Services Menu
            </button>
          </div>

          <div className="scheduler" style={{ boxShadow: '0 12px 40px rgba(13,27,42,0.05)' }}>
            <h3>Request Consultation</h3>
            <p>Arrange an engagement review regarding our specialized {service.title} frameworks.</p>

            {!isSubmitted ? (
              <form onSubmit={handleFormSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input type="text" id="fname" value={formData.fname} onChange={handleInputChange} placeholder="Ravi" required />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" id="lname" value={formData.lname} onChange={handleInputChange} placeholder="Kumar" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Company Identity</label>
                  <input type="text" id="company" value={formData.company} onChange={handleInputChange} placeholder="Your Enterprise Pvt Ltd" />
                </div>
                <div className="form-group">
                  <label>Phone Line Number *</label>
                  <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" required />
                </div>
                <div className="form-group">
                  <label>Scope Context</label>
                  <input type="text" value={service.title} disabled style={{ background: 'var(--cream2)', color: 'var(--navy)', fontWeight: '500' }} />
                </div>
                <div className="form-group">
                  <label>Operational Note Requirements (Optional)</label>
                  <textarea id="message" value={formData.message} onChange={handleInputChange} placeholder="Specify estimated staff pool sizes or historical audit bottlenecks..." />
                </div>
                <button type="submit" className="submit-btn" style={{ marginTop: '0.5rem' }}>Submit Inquiry Request →</button>
              </form>
            ) : (
              <div className="success-msg" style={{ display: 'block', padding: '1rem 0' }}>
                <div className="check">✅</div>
                <h4>Inquiry Logged Successfully!</h4>
                <p>Thank you! Our compliance officers will process your requirements regarding {service.title} and contact you shortly.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}