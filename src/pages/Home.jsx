import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '/src/components/Navbar.jsx';
import Footer from '/src/components/Footer.jsx';
import ScrollReveal from '/src/components/ScrollReveal.jsx';

export default function Home() {
  const navigate = useNavigate();

  // Form input states
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Clickable service interaction handler
  const handleServiceClick = (slugId) => {
    navigate(`/services/${slugId}`);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!formData.fname || !formData.phone) {
      alert('Please fill in your name and phone number to continue.');
      return;
    }

    try {
      // Send the form data straight to our Node.js server endpoint
      const response = await fetch('http://localhost:5001/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
      } else {
        alert('Server Error: ' + (data.error || 'Failed to save enquiry.'));
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Could not connect to the server. Please ensure your backend is running on port 5000.');
    }
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section id="hero">
        <div className="hero-badge">Trusted HR & Payroll Partner · Hyderabad</div>
        <h1>Simplifying <em>HR Compliance</em><br />& Payroll for Growing Businesses</h1>
        <p>End-to-end workforce management — from offer letters to full & final settlements, PF/ESI, labour law, and statutory compliance. All under one roof.</p>
        <div className="hero-btns">
          <a href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); }}>Request Enquiry</a>
          <a href="#services" className="btn-outline" onClick={(e) => { e.preventDefault(); document.getElementById('services').scrollIntoView({ behavior: 'smooth' }); }}>Explore Services</a>
          <button className="btn-outline" onClick={() => navigate('/login')} style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}>Admin Portal →</button>
        </div>
        <div className="hero-stats">
          <div className="stat"><div className="num">100%</div><div className="lbl">Clients Satisfaction</div></div>
          <div className="stat"><div className="num">8+</div><div className="lbl">Industries</div></div>
          <div className="stat"><div className="num">100%</div><div className="lbl">Compliance Rate</div></div>
    
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-grid">
          <ScrollReveal>
            <p className="section-label">About Us</p>
            <h2 className="section-title">Who We Are</h2>
            <p className="section-sub">Vinalax HR Solutions LLP is a professional HR, payroll, and labour compliance service organization providing comprehensive workforce management solutions to businesses across industries.</p>
            <p className="section-sub" style={{ marginTop: '0.8rem' }}>We support businesses in streamlining employee administration, ensuring statutory compliance, reducing legal risks, and maintaining structured systems.</p>
            <div className="about-pillars">
              <div className="pillar"><div className="pillar-icon">🎯</div><h4>Accuracy First</h4><p>Zero-error payroll and compliance processing, every time.</p></div>
              <div className="pillar"><div className="pillar-icon">⏱️</div><h4>On-Time Delivery</h4><p>Never miss a statutory filing deadline again.</p></div>
              <div className="pillar"><div className="pillar-icon">🔒</div><h4>Confidentiality</h4><p>Your employee and financial data stays protected always.</p></div>
              <div className="pillar"><div className="pillar-icon">📋</div><h4>Reliability</h4><p>Consistent, professional service you can count on.</p></div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="about-right">
              <h3>Our Commitment to Clients</h3>
              <ul className="about-list">
                <li>We believe workforce compliance is not merely about filings and documentation</li>
                <li>Protecting businesses from legal and regulatory risks</li>
                <li>Building structured HR and payroll systems from the ground up</li>
                <li>Maintaining professional practices across all workforce stages</li>
                <li>Ensuring operational and legal discipline at all times</li>
                <li>Supporting long-term organizational growth through strong HR foundations</li>
                <li>Process-driven execution with complete documentation</li>
                <li>Client satisfaction as the core of every engagement</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <ScrollReveal>
          <div className="services-header">
            <p className="section-label">What We Do</p>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">Comprehensive HR, payroll, and compliance solutions tailored to your business size and sector. (Click any card to explore further)</p>
          </div>
        </ScrollReveal>
        
        <div className="services-grid">
          <ScrollReveal>
            <div className="service-card" onClick={() => handleServiceClick('hr-solutions')}>
              <div className="service-icon">📄</div>
              <h3>HR Solutions</h3>
              <p>Complete employee lifecycle management — from hiring documentation through to full & final settlements. We handle the paperwork so you can focus on your business.</p>
              <div className="service-tags">
                <span className="service-tag">Offer Letters</span>
                <span className="service-tag">Appointment Letters</span>
                <span className="service-tag">Employee Documentation</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="service-card" onClick={() => handleServiceClick('payroll-management')}>
              <div className="service-icon">💰</div>
              <h3>Payroll Management</h3>
              <p>Accurate, timely salary processing with full integration of attendance, leave, bonuses, and statutory deductions. Payslips generated and distributed on schedule.</p>
              <div className="service-tags">
                <span className="service-tag">Salary Processing</span>
                <span className="service-tag">Payslip Generation</span>
                <span className="service-tag">Full & Final Settlement</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="service-card" onClick={() => handleServiceClick('statutory-compliance')}>
              <div className="service-icon">⚖️</div>
              <h3>Statutory Compliance</h3>
              <p>Stay fully compliant with all labour laws and statutory obligations. We manage PF, ESI, professional tax, and all monthly/annual returns so you never face penalties.</p>
              <div className="service-tags">
                <span className="service-tag">PF & ESI</span>
                <span className="service-tag">Monthly Returns</span>
                <span className="service-tag">Law Advisory</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="service-card" onClick={() => handleServiceClick('licences-registrations')}>
              <div className="service-icon">🏗️</div>
              <h3>Licences & Registrations</h3>
              <p>We handle all statutory registrations and licences your business requires — including Shop & Establishment Act, BOCW, CLRA, and other applicable licences.</p>
              <div className="service-tags">
                <span className="service-tag">Shop & Establishment</span>
                <span className="service-tag">BOCW</span>
                <span className="service-tag">CLRA</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="service-card" onClick={() => handleServiceClick('employee-lifecycle')}>
              <div className="service-icon">🔄</div>
              <h3>Employee Lifecycle Management</h3>
              <p>Seamless management from onboarding to exit. Every stage of the employee journey is handled professionally — documentation, records, and compliance at each step.</p>
              <div className="service-tags">
                <span className="service-tag">Onboarding</span>
                <span className="service-tag">Attendance & Leave</span>
                <span className="service-tag">Relieving Letters</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="service-card" onClick={() => handleServiceClick('hr-advisory')}>
              <div className="service-icon">📊</div>
              <h3>HR Advisory & Consulting</h3>
              <p>Expert guidance on HR policy, salary structure, labour law compliance strategy, and workforce management best practices — customised to your business needs.</p>
              <div className="service-tags">
                <span className="service-tag">HR Policy</span>
                <span className="service-tag">Salary Structuring</span>
                <span className="service-tag">Compliance Strategy</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why">
        <ScrollReveal>
          <div className="why-header">
            <p className="section-label" style={{ color: 'var(--gold2)' }}>Why Vinalax</p>
            <h2 className="section-title light">Why Choose Vinalax?</h2>
            <p className="section-sub" style={{ color: 'rgba(255,255,255,0.45)' }}> We bring the expertise, technology, and dedication that growing businesses need to stay fully compliant and operationally strong.</p>
          </div>
        </ScrollReveal>
        <div className="why-grid">
          {['Expert Team', 'End-to-End Support', 'Technology-Driven', 'Zero Notices & Penalties', 'Customised Solutions', 'Scalability'].map((title, idx) => (
            <ScrollReveal key={idx}>
              <div className="why-card">
                <div className="why-num">{String(idx + 1).padStart(2, '0')}</div>
                <h3>{title}</h3>
                <p>Tailored workforce solutions focused heavily on operational accuracy and zero compliance risk.</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="industries">
        <ScrollReveal>
          <div className="industries-header">
            <p className="section-label">Who We Serve</p>
            <h2 className="section-title">Industries We Serve</h2>
            <p className="section-sub">Our expertise spans across diverse sectors, bringing industry-specific HR and compliance knowledge to every client.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="industries-wrap">
            {['🏭 Manufacturing', '🏗️ Construction & Infra', '💻 IT & Startups', '🎓 Educational Institutions', '🏥 Healthcare & Hospitals', '🛒 Retail Businesses', '🚛 Logistics & Warehousing', '🏢 Professional Firms'].map((ind, i) => (
              <div className="industry-chip" key={i}>{ind}</div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* PROCESS */}
      <section id="process">
        <ScrollReveal>
          <div className="process-header">
            <p className="section-label">How We Work</p>
            <h2 className="section-title">Our Work Process</h2>
            <p className="section-sub">A structured, technology-driven approach that ensures accuracy, timeliness, and full compliance at every stage.</p>
          </div>
        </ScrollReveal>
        <div className="process-steps">
          {['Understand Requirements', 'Data Collection', 'System Setup', 'Statutory Filings', 'Reports & Records', 'Ongoing Support'].map((step, i) => (
            <ScrollReveal key={i}>
              <div className="process-step">
                <div className="step-circle">{i + 1}</div>
                <h4>{step}</h4>
                <p>Systematic handling to ensure optimized execution loops.</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CONTACT & GET IN TOUCH FORM */}
      <section id="contact">
        <div className="contact-grid">
          <ScrollReveal>
            <div className="contact-info">
              <p className="section-label" style={{ color: 'var(--gold2)' }}>Get In Touch</p>
              <h2>Let's Work <em>Together</em></h2>
              <p>Schedule a free consultation with our HR experts. We'll understand your business challenges and suggest the right compliance and payroll solution for you.</p>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-item-icon">🌐</div>
                  <div className="contact-item-text"><strong>Email</strong>vinalaxhrsolutions@gmail.com</div>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">📞</div>
                  <div className="contact-item-text"><strong>Phone</strong>+91 93471 73466</div>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">📍</div>
                  <div className="contact-item-text"><strong>Location</strong>Flat No-103, Everest Block, Adithya Enclave, Beside Ameerpet Metro Station, Ameerpet, Hyderabad- 500038</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="scheduler">
              <h3>Get In Touch</h3>
              <p>Fill out the details below. Our corporate consulting team will reach out to connect.</p>

              {!isSubmitted ? (
                <form onSubmit={submitBooking}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" id="fname" value={formData.fname} onChange={handleInputChange} placeholder="Ravi" required />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" id="lname" value={formData.lname} onChange={handleInputChange} placeholder="Kumar" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" id="company" value={formData.company} onChange={handleInputChange} placeholder="Your Company Pvt Ltd" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" required />
                  </div>
                  <div className="form-group">
                    <label>Service Interested In</label>
                    <select id="service" value={formData.service} onChange={handleInputChange} required>
                      <option value="">Select a service...</option>
                      <option value="HR Solutions & Documentation">HR Solutions & Documentation</option>
                      <option value="Payroll Management">Payroll Management</option>
                      <option value="Statutory Compliance (PF/ESI)">Statutory Compliance (PF/ESI)</option>
                      <option value="Licences & Registrations">Licences & Registrations</option>
                      <option value="Employee Lifecycle Management">Employee Lifecycle Management</option>
                      <option value="HR Advisory & Consulting">HR Advisory & Consulting</option>
                      <option value="All / Not Sure Yet">All / Not Sure Yet</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message (Optional)</label>
                    <textarea id="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us briefly about your requirements..." />
                  </div>

                  <button type="submit" className="submit-btn">Request Enquiry →</button>
                </form>
              ) : (
                <div className="success-msg">
                  <div className="check">✅</div>
                  <h4>Enquiry Submitted!</h4>
                  <p>Thank you! Our corporate consulting team will contact you shortly regarding your requirements.</p>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}>📞 +91 93471 73466</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}