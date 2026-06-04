import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Real-time server-side database storage state
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter and Search Inputs States
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchService, setSearchService] = useState('');
  const [searchDate, setSearchDate] = useState('');
  
  // Sorting Configuration State
  const [sortType, setSortType] = useState('newest'); 

  // Core API Fetch Function
  const fetchEnquiriesFromDatabase = async () => {
    setLoading(true);
    setErrorMessage('');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://vinalaxbackend.onrender.com/api/enquiries', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // Sends the secure JWT token to unlock the route
        }
      });

      if (response.status === 401 || response.status === 403) {
        // Token is missing, expired, or invalid
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setEnquiries(data);
      } else {
        setErrorMessage(data.message || 'Failed to read data entries.');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setErrorMessage('Database connection down. Verify backend network.');
    } finally {
      setLoading(false);
    }
  };

  // Run database read on execution mount
  useEffect(() => {
    fetchEnquiriesFromDatabase();
  }, [activeTab]); // Refreshes data when tabs switch

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ── DYNAMIC CHRONOLOGICAL COUNTER CALCULATIONS ──
  const getMetricCounts = () => {
    const todayStr = new Date().toISOString().split('T')[0]; 
    const currentMonthPrefix = todayStr.substring(0, 7);     
    const currentYearPrefix = todayStr.substring(0, 4);      

    let countToday = 0;
    let countMonth = 0;
    let countYear = 0;

    enquiries.forEach(e => {
      if (e.date === todayStr) countToday++;
      if (e.date && e.date.startsWith(currentMonthPrefix)) countMonth++;
      if (e.date && e.date.startsWith(currentYearPrefix)) countYear++;
    });

    return { today: countToday, month: countMonth, year: countYear, total: enquiries.length };
  };

  const metrics = getMetricCounts();

  // ── LIVE SEARCH FILTERS AND ALPHABETICAL RE-SORT ROUTINES ──
  const getFilteredAndSortedEnquiries = () => {
    let result = enquiries.filter(e => {
      const matchName = e.name.toLowerCase().includes(searchName.toLowerCase());
      const matchCompany = (e.company || '').toLowerCase().includes(searchCompany.toLowerCase());
      const matchService = e.service.toLowerCase().includes(searchService.toLowerCase());
      const matchDate = searchDate ? e.date === searchDate : true;
      
      return matchName && matchCompany && matchService && matchDate;
    });

    if (sortType === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return result;
  };

  const processedEnquiries = getFilteredAndSortedEnquiries();

  // ── EXPORT ENGINE FOR CSV DOWNLOADING ──
  const triggerCSVDownload = (dataset, filename) => {
    if (dataset.length === 0) return alert("No enquiry entries found to generate a report.");
    
    const headers = ["Submission Date", "Client Name", "Company", "Phone Contact", "Service Interest Segment", "Message Details String"];
    const rows = dataset.map(e => [
      `"${e.date ? e.date.split('-').reverse().join('/') : ''}"`,
      `"${e.name}"`,
      `"${e.company || 'Private Lead'}"`,
      `"${e.phone}"`,
      `"${e.service}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  // Secure Database Clear Call
  const deleteEnquiry = async (id) => {
    if (!window.confirm('Permanently delete this enquiry record from Atlas cloud?')) return;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://vinalaxbackend.onrender.com/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove locally from state array layout immediately so it reflects UI without page refresh
        setEnquiries(prev => prev.filter(e => e.id !== id));
      } else {
        alert('Could not erase database file line.');
      }
    } catch (error) {
      console.error(error);
      alert('Network failure processing delete instruction.');
    }
  };

  return (
    <div className="app" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* SIDEBAR NAVIGATION WORKSPACE BAR */}
      <aside className="sidebar" style={{ width: 'var(--sidebar)', height: '100%', flexShrink: 0 }}>
        <div className="sidebar-logo">
          {/* <div className="sidebar-logo-icon">v</div> */}
          {/* ── HIGH-VISIBILITY MATCHING ADMIN BRAND LOGO ── */}
<div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
  
  <div style={{
    width: '42px',               // Sized slightly more compact for an administrative workspace sidebar
    height: '42px',
    borderRadius: '50%',
    background: '#ffffff',       // Matches the high-contrast white backing card
    border: '1px solid #e0a96d', // Elegant brand gold accent line
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px',
    boxSizing: 'border-box',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    flexShrink: 0
  }}>
    <img 
      src="/VHR_LogoCircle_Transparent.png" 
      alt="Vinalax Admin Logo"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'contain'
      }}
    />
  </div>

  {/* Admin Header Text Layout */}
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '1rem', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.02em' }}>
      Vinalax
    </span>
    <span style={{ color: '#e0a96d', fontSize: '0.65rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      HR Solutions LLP
    </span>
  </div>

</div>
          
          <div className="sidebar-logo-name">Vinalax Admin</div>
       
        </div>

        <div className="sidebar-section">Workspace Core</div>
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          📊 <span>Dashboard Summary</span>
        </div>
        <div className={`nav-item ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => setActiveTab('enquiries')}>
          📨 <span>View Enquiries</span> 
          <span className="badge">{enquiries.length}</span>
        </div>

        <div className="sidebar-section" style={{ marginTop: 'auto' }}>Session Control</div>
        <div className="nav-item" onClick={handleLogout} style={{ color: 'var(--red)' }}>
          🔒 <span>Exit Portal</span>
        </div>
      </aside>

      {/* REACTION MAIN GRID MAPPED WRAPPER */}
      <div className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="topbar" style={{ display: 'flex', alignItems: 'center', justifyURI: 'space-between', justifyContent: 'space-between', width: '100%' }}>
          <div className="topbar-title" style={{ textTransform: 'capitalize' }}>Operations Gateway: {activeTab}</div>
          <div className="topbar-right">
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: '500' }}>Active System Operator</span>
          </div>
        </div>

        <div className="content" style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
          
          {errorMessage && (
            <div className="alert alert-error" style={{ display: 'block', marginBottom: '1.5rem' }}>
              ⚠️ {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="empty" style={{ padding: '6rem 0' }}>🔄 Syncing database streams with your Atlas cluster...</div>
          ) : (
            <>
              {/* TAB PANEL 1: DASHBOARD SUMMARY VIEW */}
              {activeTab === 'dashboard' && (
                <div className="page active" style={{ display: 'block' }}>
                  <div className="stats-row">
                    <div className="stat-card">
                      <div className="label">Enquiries Today</div>
                      <div className="value" style={{ color: 'var(--blue)' }}>{metrics.today}</div>
                      <div className="delta">Current Work Date</div>
                    </div>
                    <div className="stat-card">
                      <div className="label">Enquiries This Month</div>
                      <div className="value" style={{ color: 'var(--gold)' }}>{metrics.month}</div>
                      <div className="delta">Monthly Pipeline</div>
                    </div>
                    <div className="stat-card">
                      <div className="label">Enquiries This Year</div>
                      <div className="value" style={{ color: 'var(--navy)' }}>{metrics.year}</div>
                      <div className="delta">Yearly Horizon Tracking</div>
                    </div>
                    <div className="stat-card">
                      <div className="label">All-Time Total Logged</div>
                      <div className="value" style={{ color: 'var(--green)' }}>{metrics.total}</div>
                      <div className="delta">Grand Cumulative Index</div>
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: '2rem' }}>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="card-title">Recent Customer Submissions Activity Queue</div>
                      <button className="btn btn-gold btn-sm" onClick={() => setActiveTab('enquiries')}>View Enquiries Panel →</button>
                    </div>
                    
                    {enquiries.length === 0 ? <div className="empty">No entries logged in Atlas database collections.</div> : (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {enquiries.slice(-4).reverse().map(e => (
                          <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 0', borderBottom: '1px solid var(--cream2)', fontSize: '0.85rem' }}>
                            <div>
                              <strong>{e.name}</strong> <span style={{ color: 'var(--muted)' }}>· {e.company || 'Individual Focus'}</span>
                              <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginTop: '0.15rem' }}>🎯 {e.service}</div>
                            </div>
                            <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>🗓️ {e.date ? e.date.split('-').reverse().join('/') : ''}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB PANEL 2: ENQUIRIES LEDGER TABLE WITH DUAL SpreadSheet DOWNLOAD HOOKS */}
              {activeTab === 'enquiries' && (
                <div className="page active" style={{ display: 'block' }}>
                  {/* FILTER CONTROLS DISPLAY */}
                  <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--white)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--navy)', marginBottom: '1rem' }}>
                      🔍 Live Filter & Sort Controls
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.68rem' }}>Filter by Name</label>
                        <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="e.g. Rajesh" style={{ padding: '0.5rem' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.68rem' }}>Filter by Company</label>
                        <input type="text" value={searchCompany} onChange={(e) => setSearchCompany(e.target.value)} placeholder="e.g. ABC Infra" style={{ padding: '0.5rem' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.68rem' }}>Filter by Service</label>
                        <select value={searchService} onChange={(e) => setSearchService(e.target.value)} style={{ padding: '0.5rem', height: '100%', background: 'var(--light)', border: '1px solid var(--cream2)', borderRadius: '6px' }}>
                          <option value="">All Services</option>
                          <option value="HR Solutions & Documentation">HR Solutions & Documentation</option>
                          <option value="Payroll Management">Payroll Management</option>
                          <option value="Statutory Compliance (PF/ESI)">Statutory Compliance (PF/ESI)</option>
                          <option value="Licences & Registrations">Licences & Registrations</option>
                          <option value="Employee Lifecycle Management">Employee Lifecycle Management</option>
                          <option value="HR Advisory & Consulting">HR Advisory & Consulting</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.68rem' }}>Filter by Date</label>
                        <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} style={{ padding: '0.45rem' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: '600' }}>Chronological Sort</label>
                        <select value={sortType} onChange={(e) => setSortType(e.target.value)} style={{ padding: '0.5rem', borderColor: 'var(--gold)', fontWeight: '500', background: 'var(--white)' }}>
                          <option value="newest">🗓️ Newest to Older</option>
                          <option value="oldest">🗓️ Older to Newest</option>
                          <option value="az">🔤 Alphabetical (A-Z)</option>
                        </select>
                      </div>
                    </div>
                    {(searchName || searchCompany || searchService || searchDate) && (
                      <button onClick={() => { setSearchName(''); setSearchCompany(''); setSearchService(''); setSearchDate(''); }} style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '500' }}>
                        Reset Filter Fields ✕
                      </button>
                    )}
                  </div>

                  {/* DATA LOG GRID TABLE */}
                  <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div className="card-title">Enquiry Dossier Ledger ({processedEnquiries.length} matching)</div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary btn-sm" style={{ background: 'var(--navy2)', fontSize: '0.75rem' }} onClick={() => triggerCSVDownload(processedEnquiries, 'filtered_enquiries')}>
                          ⬇ Download Filtered Rows
                        </button>
                        <button className="btn btn-gold btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => triggerCSVDownload(enquiries, 'all_master_enquiries')}>
                          ⭐ Download Full Master Log
                        </button>
                      </div>
                    </div>

                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Submission Date</th>
                            <th>Client / Corporate Details</th>
                            <th>Service Interest</th>
                            <th>Detailed Message Context</th>
                            <th style={{ textAlign: 'center' }}>Purge</th>
                          </tr>
                        </thead>
                        <tbody>
                          {processedEnquiries.map((e) => (
                            <tr key={e.id}>
                              <td style={{ whiteSpace: 'nowrap', fontWeight: '500', color: 'var(--navy)' }}>
                                {e.date ? e.date.split('-').reverse().join('/') : '—'}
                              </td>
                              <td>
                                <div style={{ fontWeight: '600', color: 'var(--text)' }}>{e.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.15rem' }}>🏢 {e.company || 'Private Lead'}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>📞 {e.phone}</div>
                              </td>
                              <td>
                                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{e.service}</span>
                              </td>
                              <td style={{ color: 'var(--text)', fontSize: '0.82rem', lineHeight: '1.5', minWidth: '280px' }}>
                                <div style={{ background: 'var(--light)', padding: '0.65rem 0.85rem', borderRadius: '6px', borderLeft: '3px solid var(--cream2)' }}>
                                  "{e.message || 'No additional specifications provided.'}"
                                </div>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteEnquiry(e.id)} style={{ padding: '0.35rem 0.5rem' }}>
                                  🗑
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {processedEnquiries.length === 0 && (
                      <div className="empty" style={{ padding: '4rem 1rem' }}>
                        No matching enquiry metrics detected within this search context.
                      </div>
                )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
