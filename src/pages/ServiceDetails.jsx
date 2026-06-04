import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

// 1. PERFECTED DATA STRUCTURE WITH YOUR EXACT SERVICES
const SERVICE_DATA = {
  'hr-solutions': {
    title: 'HR Solutions & Documentation',
    icon: '📄',
    description: 'Complete employee lifecycle documentation from onboarding packages to structured compliance records. We manage your workforce paperwork professionally to shield your enterprise.',
    deliverables: [
      'Offer Letters & Joining Frameworks',
      'Appointment Letters aligned with legal standards',
      'Comprehensive Employee Documentation kits',
      'Structured HR File Management & Records tracking',
      'Probation Confirmation Letters',
      'Increment & Transfer Letters',
      'Warning & Disciplinary Action Documentation',
      'Relieving & Experience Certification Letters',
      'Exit Formalities Management & Clearance Documentation',
      'Termination Documentation Legal Support'
    ]
  },
  'payroll-management': {
    title: 'Payroll Management Outsourcing',
    icon: '💰',
    description: 'Accurate, highly disciplined monthly salary calculations integrating attendance data, complex CTC components, and statutory compliance protocols.',
    deliverables: [
      'End-to-End Salary Processing routines',
      'Automated, itemized Payslip Generation & distribution',
      'Attendance & Leave Tracking Module Integration',
      'Tax-optimized Payroll Structuring (CTC Architecture)',
      'Bonus, Gratuity, & Incentive Processing loops',
      'Exhaustive Full & Final (F&F) Settlements evaluations',
      'Audit-ready Employee Salary Records maintenance'
    ]
  },
  'statutory-compliance': {
    title: 'Statutory Compliance Services',
    icon: '⚖️',
    description: 'Stay completely protected under pan-India labor laws and central mandates. We manage monthly filings, documentation trails, and advisory routines seamlessly.',
    deliverables: [
      'Provident Fund (PF) Compliance processing',
      'Employee State Insurance (ESI) Compliance handling',
      'Professional Tax (PT) calculations and local filings',
      'Labour Welfare Fund (LWF) Compliance routines',
      'Timely compilation of Monthly Returns & Statutory Registers',
      'Contractor Compliance & Vendor Audit Support',
      'Proactive, expert Labour Law Advisory consulting'
    ]
  },
  'licences-registrations': {
    title: 'Registration & Licensing Services',
    icon: '🏗️',
    description: 'Acquire all essential operational licenses and state corporate enrollments your industry demands to safely launch and run your enterprise.',
    deliverables: [
      'Provident Fund (PF) Corporate Registration',
      'Employee State Insurance (ESI) Entity Registration',
      'Professional Tax (PT) Corporate Registration',
      'Shop & Establishment Act Registration',
      'CLRA (Contract Labour Regulation & Abolition) Registration & Licences',
      'Industrial Factory Licence acquisition support',
      'BOCW (Building & Other Construction Workers) Act Registrations',
      'MSME Udyam Registration execution'
    ]
  },
  'employee-lifecycle': {
    title: 'Employee Lifecycle Management',
    icon: '🔄',
    description: 'Seamless professional handling from day-one onboarding tasks up to clear separation exit strategies. Every transition phase is fully supported with complete paperwork logs.',
    deliverables: [
      'Structured Company Orientation & Integration workflows',
      'Leave Management Systems, custom Holiday Calendars & Shift Rosters',
      'Performance Management Evaluation documentation support',
      'Formal Resignation acceptance tracking loops',
      'Expedited delivery of Relieving and Experience Certification letters',
      'Comprehensive Exit Interviews & Feedback logging operations'
    ]
  },
  'hr-advisory': {
    title: 'HR Advisory & Strategy Consulting',
    icon: '📊',
    description: 'Expert corporate consultation on scaling internal policies, tax-optimized salary components, legal risk management assessments, and modern workplace governance.',
    deliverables: [
      'Drafting customized Company HR Policies & Employee Handbooks',
      'Tax-efficient Salary Structures (CTC restructuring & modeling blocks)',
      'Strategic labor risk audit mappings & preventative assessments',
      'Growth scalability structural designs for growing business teams'
    ]
  }
};

export default function ServiceDetails() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = SERVICE_DATA[serviceId];

  const [formData, setFormData] = useState({ fname: '', lname: '', company: '', phone: '' });
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fname || !formData.phone) {
      alert('Please fill out Name and Phone fields.');
      return;
    }

    try {
      const response = await fetch('https://vinalaxbackend.onrender.com/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fname: formData.fname,
          lname: formData.lname,
          company: formData.company,
          phone: formData.phone,
          service: service.title,
          message: `Inquiry registered for ${service.title} specialized operational framework.`
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsSubmitted(true);
      } else {
        alert('Server Error: ' + (data.error || 'Failed to submit inquiry.'));
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Cannot connect to backend API. Please confirm your server is running on port 5001.');
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Banner Section */}
      <section style={{ background: '#0d1b2a', minHeight: '42vh', paddingTop: '9rem', paddingBottom: '4rem', textAlign: 'center', paddingLeft: '5%', paddingRight: '5%' }}>
        <div style={{ background: 'rgba(224, 169, 109, 0.1)', color: '#e0a96d', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', padding: '0.5rem 1.25rem', borderRadius: '50px', display: 'inline-block', marginBottom: '1rem', border: '1px solid rgba(224, 169, 109, 0.2)' }}>
          Service Vertical Overview
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#ffffff', fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: '600', margin: '0 auto', maxWidth: '900px' }}>
          {service.icon} {service.title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '750px', margin: '1.5rem auto 0', fontSize: '1.05rem', lineHeight: '1.7', fontWeight: '300' }}>
          {service.description}
        </p>
      </section>

      {/* Main Breakdown Section */}
      <section style={{ background: '#faf9f6', padding: '5rem 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', maxWidth: '1200px', margin: '0 auto', alignItems: 'start' }}>
          
          {/* Left Side: Services Offered Checklist */}
          <div>
            <p style={{ color: '#e0a96d', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              Strategic Offerings
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#0d1b2a', fontWeight: '600', marginBottom: '1.5rem', marginTop: 0 }}>
              What We Manage & Offer
            </h2>
            <p style={{ color: '#555555', fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
              Vinalax delivers highly compliant process execution blueprints. Here are the dedicated corporate capacities included under this operational vertical:
            </p>
            
            {/* The Dynamic, Custom Offerings List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {service.deliverables.map((item, idx) => (
                <div key={idx} style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '8px', border: '1px solid #e2dfd5', display: 'flex', gap: '1.25rem', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <span style={{ color: '#e0a96d', fontWeight: 'bold', fontSize: '1.3rem', lineHeight: '1' }}>✓</span>
                  <span style={{ color: '#0d1b2a', fontSize: '0.95rem', fontWeight: '500' }}>{item}</span>
                </div>
              ))}
            </div>

            <button className="btn-outline" onClick={() => navigate('/')} style={{ marginTop: '3rem', color: '#0d1b2a', borderColor: '#0d1b2a', background: 'transparent', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s ease' }}>
              ← Return to Main Operations Menu
            </button>
          </div>

          {/* Right Side: Consultation Form Side Desk */}
          <div style={{ background: '#ffffff', border: '1px solid #e2dfd5', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 12px 40px rgba(13,27,42,0.04)' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: '#0d1b2a', margin: '0 0 0.5rem 0' }}>Request Corporate Consultation</h3>
            <p style={{ color: '#555555', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 2rem 0' }}>
              Arrange an operational review regarding our specialized {service.title} frameworks.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#0d1b2a', textTransform: 'uppercase' }}>First Name *</label>
                    <input type="text" id="fname" value={formData.fname} onChange={handleInputChange} style={{ padding: '0.75rem', border: '1px solid #c8c5ba', borderRadius: '4px', background: '#faf9f6' }} placeholder="Ravi" required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#0d1b2a', textTransform: 'uppercase' }}>Last Name</label>
                    <input type="text" id="lname" value={formData.lname} onChange={handleInputChange} style={{ padding: '0.75rem', border: '1px solid #c8c5ba', borderRadius: '4px', background: '#faf9f6' }} placeholder="Kumar" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#0d1b2a', textTransform: 'uppercase' }}>Company Identity</label>
                  <input type="text" id="company" value={formData.company} onChange={handleInputChange} style={{ padding: '0.75rem', border: '1px solid #c8c5ba', borderRadius: '4px', background: '#faf9f6' }} placeholder="Your Enterprise Pvt Ltd" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#0d1b2a', textTransform: 'uppercase' }}>Phone Line Number *</label>
                  <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} style={{ padding: '0.75rem', border: '1px solid #c8c5ba', borderRadius: '4px', background: '#faf9f6' }} placeholder="+91 98765 43210" required />
                </div>
                <button type="submit" style={{ marginTop: '1rem', background: '#0d1b2a', color: '#ffffff', border: 'none', padding: '0.9rem', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.03em' }}>
                  Submit Inquiry Request →
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#0d1b2a', fontSize: '1.2rem' }}>Inquiry Logged Successfully!</h4>
                <p style={{ color: '#555555', fontSize: '0.88rem', margin: 0, lineHeight: '1.6' }}>
                  Thank you. Our corporate operations officers will map your requirements regarding {service.title} and connect with you shortly.
                </p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 2. BEAUTIFUL WORKFLOW PIELINE EXTRA VALUE ADDITION SECTION */}
      <section style={{ background: '#f0ede4', padding: '5rem 5%', borderTop: '1px solid #e2dfd5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#e0a96d', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
            Lifecycle Optimization
          </p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#0d1b2a', fontWeight: '600', marginBottom: '3rem' }}>
            Our End-To-End Employee Management Pipeline
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', alignItems: 'start', position: 'relative' }}>
            
            {/* Stage 1 */}
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2dfd5', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <div style={{ background: '#0d1b2a', color: '#e0a96d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycontent: 'center', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1.25rem', margin: '0 0 1rem 0', paddingLeft: '11px', boxSizing: 'border-box' }}>1</div>
              <h4 style={{ color: '#0d1b2a', fontSize: '1.1rem', margin: '0 0 0.75rem 0', fontWeight: '600' }}>Hiring Stage</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#555555', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.5' }}>
                <li>Offer Letter Issuance</li>
                <li>Appointment Letter Drafting</li>
                <li>Seamless Joining Documentation</li>
              </ul>
            </div>

            {/* Stage 2 */}
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2dfd5', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <div style={{ background: '#0d1b2a', color: '#e0a96d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycontent: 'center', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1.25rem', margin: '0 0 1rem 0', paddingLeft: '10px', boxSizing: 'border-box' }}>2</div>
              <h4 style={{ color: '#0d1b2a', fontSize: '1.1rem', margin: '0 0 0.75rem 0', fontWeight: '600' }}>Employment Stage</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#555555', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.5' }}>
                <li>Disciplined Payroll Management</li>
                <li>Attendance & Leave Integration</li>
                <li>Rigorous Compliance Auditing</li>
                <li>Strategic HR File Management</li>
              </ul>
            </div>

            {/* Stage 3 */}
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2dfd5', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <div style={{ background: '#0d1b2a', color: '#e0a96d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycontent: 'center', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1.25rem', margin: '0 0 1rem 0', paddingLeft: '10px', boxSizing: 'border-box' }}>3</div>
              <h4 style={{ color: '#0d1b2a', fontSize: '1.1rem', margin: '0 0 0.75rem 0', fontWeight: '600' }}>Exit Stage</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#555555', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.5' }}>
                <li>Resignation Processing loops</li>
                <li>Full & Final (F&F) Settlement</li>
                <li>Official Relieving Letter delivery</li>
                <li>Experience Letter & Exit Files</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
