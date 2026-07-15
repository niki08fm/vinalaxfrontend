// components/PortalShell.jsx — sidebar + topbar app shell for the Client
// Portal, matching HRMSOFTWARE's internal admin console look and feel.
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/clientPortal.css';
import { initials } from '../utils/portalFormat';

const COMPANY_NAV = [
  { key: 'payrolls', icon: '◫', label: 'Payroll runs' },
  { key: 'payslips', icon: '▥', label: 'Payslips' },
  { key: 'password', icon: '◍', label: 'Change password' }
];

const EMPLOYEE_NAV = [
  { key: 'overview', icon: '◉', label: 'Overview' },
  { key: 'payslips', icon: '▥', label: 'My payslips' },
  { key: 'password', icon: '◍', label: 'Change password' }
];

export default function PortalShell({ me, title, tab, onTabChange, children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isCompany = me?.role === 'COMPANY';
  const nav = isCompany ? COMPANY_NAV : EMPLOYEE_NAV;
  const name = isCompany ? (me?.company_name || 'Company') : (me?.full_name || 'Employee');

  useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const logout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_user');
    navigate('/portal/login');
  };

  return (
    <div className="vhrp-root">
      <div className="vhrp-app">
        <aside className={`vhrp-sidebar ${sidebarOpen ? 'vhrp-open' : ''}`}>
          <div className="vhrp-brand">
            <div className="vhrp-brand-mark">V</div>
            <div>
              <div className="vhrp-brand-name">Vinalax</div>
              <div className="vhrp-brand-sub">HR Solutions</div>
            </div>
          </div>
          <div className="vhrp-nav">
            <div className="vhrp-nav-section">{isCompany ? 'Company Portal' : 'My Space'}</div>
            {nav.map(item => (
              <button
                key={item.key}
                className={`vhrp-nav-item ${tab === item.key ? 'vhrp-active' : ''}`}
                onClick={() => { onTabChange(item.key); setSidebarOpen(false); }}
              >
                <span className="vhrp-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="vhrp-sidebar-foot">
            <span className="vhrp-eyebrow" style={{ color: 'rgba(255,255,255,0.3)' }}>Client Portal</span>
          </div>
        </aside>
        {sidebarOpen && <div className="vhrp-scrim" onClick={() => setSidebarOpen(false)} />}

        <div className="vhrp-main">
          <header className="vhrp-topbar">
            <div className="vhrp-row vhrp-gap-sm">
              <button className="vhrp-burger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">☰</button>
              <h1 className="vhrp-topbar-title">{title}</h1>
            </div>
            <div className="vhrp-usermenu" ref={menuRef}>
              <button className="vhrp-user-trigger" onClick={() => setMenuOpen(o => !o)}>
                <span className="vhrp-avatar">{initials(name)}</span>
                <span className="vhrp-hide-mobile" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{name}</span>
                <span className="vhrp-hide-mobile" style={{ fontSize: '0.6rem', color: 'var(--vhrp-muted)' }}>▾</span>
              </button>
              {menuOpen && (
                <div className="vhrp-dropdown">
                  <div className="vhrp-dropdown-head">
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{name}</div>
                    <div className="vhrp-muted" style={{ fontSize: '0.72rem' }}>{me?.email}</div>
                    <span className="vhrp-badge vhrp-badge-gold" style={{ marginTop: 6 }}>
                      {isCompany ? 'Company' : 'Employee'}
                    </span>
                  </div>
                  <button className="vhrp-dropdown-item vhrp-danger" onClick={logout}>Sign out</button>
                </div>
              )}
            </div>
          </header>
          <div className="vhrp-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
