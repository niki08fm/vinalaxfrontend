// components/PortalUI.jsx — shared building blocks for the Client Portal,
// mirroring HRMSOFTWARE's admin console primitives (vhrp- prefixed classes).
import { useEffect } from 'react';

export function Modal({ open, onClose, title, children, footer, width = 520 }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onEsc); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="vhrp-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="vhrp-modal" style={{ maxWidth: width }} role="dialog" aria-modal="true">
        <div className="vhrp-modal-head">
          <h2 className="vhrp-modal-title">{title}</h2>
          <button className="vhrp-modal-x" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="vhrp-modal-body">{children}</div>
        {footer && <div className="vhrp-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Spinner({ large }) {
  return <span className={`vhrp-spinner ${large ? 'vhrp-spinner-lg' : ''}`} aria-label="Loading" />;
}

export function Empty({ icon = '📭', title = 'Nothing here yet', children }) {
  return (
    <div className="vhrp-empty">
      <div className="vhrp-empty-icon">{icon}</div>
      <div className="vhrp-empty-title">{title}</div>
      {children && <p className="vhrp-muted" style={{ fontSize: '0.85rem' }}>{children}</p>}
    </div>
  );
}

export function Field({ label, required, hint, error, children }) {
  return (
    <div className="vhrp-field">
      {label && <label>{label}{required && <span className="vhrp-req">*</span>}</label>}
      {children}
      {error ? <span className="vhrp-field-error">{error}</span>
        : hint ? <span className="vhrp-field-hint">{hint}</span> : null}
    </div>
  );
}

// Last 24 months as 'YYYY-MM' options, newest first.
export function MonthPicker({ value, onChange }) {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    months.push({ val, label });
  }
  return (
    <select className="vhrp-select" style={{ maxWidth: 220 }} value={value} onChange={e => onChange(e.target.value)}>
      <option value="">All months</option>
      {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
    </select>
  );
}
