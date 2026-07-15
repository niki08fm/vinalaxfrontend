import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientApi } from '/src/api/clientApi.js';

function getToken() { return localStorage.getItem('client_token'); }

export default function ClientPortal() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChangePw, setShowChangePw] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_user');
    navigate('/portal/login');
  }, [navigate]);

  useEffect(() => {
    clientApi.me(getToken())
      .then(d => setMe(d.user))
      .catch(() => { logout(); })
      .finally(() => setLoading(false));
  }, [logout]);

  if (loading) return <div className="empty" style={{ padding: '6rem 0', textAlign: 'center' }}>🔄 Loading your portal…</div>;
  if (!me) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light, #f7f5f2)' }}>
      <div style={{
        background: 'var(--navy)', color: '#fff', padding: '1.25rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600 }}>
            {me.role === 'COMPANY' ? me.company_name : me.full_name}
          </div>
          <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>
            {me.role === 'COMPANY' ? 'Company portal' : `${me.company_name || ''} · Employee portal`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-gold btn-sm" onClick={() => setShowChangePw(s => !s)}>Change password</button>
          <button className="btn btn-danger btn-sm" onClick={logout}>Log out</button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>⚠️ {error}</div>}

        {showChangePw && <ChangePasswordCard onDone={() => setShowChangePw(false)} onError={setError} />}

        {me.role === 'COMPANY' ? <CompanyView onError={setError} /> : <EmployeeView onError={setError} />}
      </div>
    </div>
  );
}

/* ── Change password ── */
function ChangePasswordCard({ onDone, onError }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    onError('');
    if (newPassword.length < 8) return onError('New password must be at least 8 characters.');
    setBusy(true);
    try {
      await clientApi.changePassword(getToken(), currentPassword, newPassword);
      onDone();
    } catch (err) { onError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div className="card-title" style={{ marginBottom: '1rem' }}>Change password</div>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group">
          <label style={{ fontSize: '0.78rem' }}>Current password</label>
          <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label style={{ fontSize: '0.78rem' }}>New password</label>
          <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: '100%' }} />
        </div>
        <button type="submit" className="btn btn-gold btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Update password'}</button>
      </form>
    </div>
  );
}

/* ── Company: payroll runs list + drill into one for payslips + Excel download ── */
function CompanyView({ onError }) {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    clientApi.companyPayrolls(getToken())
      .then(d => setRuns(d.runs || []))
      .catch(err => onError(err.message))
      .finally(() => setLoading(false));
  }, [onError]);

  const openRun = async (run) => {
    setSelected(run);
    setDetail(null);
    try {
      const d = await clientApi.companyPayrollDetail(getToken(), run.id);
      setDetail(d);
    } catch (err) { onError(err.message); }
  };

  const downloadExcel = async (run) => {
    setDownloading(true);
    try {
      await clientApi.downloadCompanyPayrollExcel(getToken(), run.id, `Payroll_${run.month_year}.xlsx`);
    } catch (err) { onError(err.message); } finally { setDownloading(false); }
  };

  if (loading) return <div className="empty">🔄 Loading payroll runs…</div>;
  if (runs.length === 0) return <div className="empty">No payroll runs yet.</div>;

  return (
    <>
      <div className="card">
        <div className="card-header"><div className="card-title">Payroll runs</div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Month</th><th>Status</th><th>Employees</th><th>Net pay</th><th></th></tr></thead>
            <tbody>
              {runs.map(r => (
                <tr key={r.id}>
                  <td>{r.month_year}</td>
                  <td><span className="badge badge-gray">{r.status}</span></td>
                  <td>{r.employee_count}</td>
                  <td>₹{Number(r.total_net || 0).toLocaleString('en-IN')}</td>
                  <td>
                    <button className="btn btn-gold btn-sm" onClick={() => openRun(r)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-title">Payslips · {selected.month_year}</div>
            <button className="btn btn-gold btn-sm" disabled={downloading} onClick={() => downloadExcel(selected)}>
              {downloading ? 'Downloading…' : '⬇ Download Excel'}
            </button>
          </div>
          {!detail ? <div className="empty">🔄 Loading…</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Employee</th><th>Department</th><th>Net pay</th><th>Status</th></tr></thead>
                <tbody>
                  {(detail.payslips || []).map(p => (
                    <tr key={p.id}>
                      <td>{p.full_name}<div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{p.employee_number}</div></td>
                      <td>{p.department || '—'}</td>
                      <td>₹{Number(p.net_pay || 0).toLocaleString('en-IN')}</td>
                      <td><span className="badge badge-gray">{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ── Employee: own payslips list + PDF download ── */
function EmployeeView({ onError }) {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    clientApi.employeePayslips(getToken())
      .then(d => setPayslips(d.payslips || []))
      .catch(err => onError(err.message))
      .finally(() => setLoading(false));
  }, [onError]);

  const downloadPdf = async (p) => {
    setDownloadingId(p.id);
    try {
      await clientApi.downloadEmployeePayslipPdf(getToken(), p.id, `Payslip_${p.month_year}.pdf`);
    } catch (err) { onError(err.message); } finally { setDownloadingId(null); }
  };

  if (loading) return <div className="empty">🔄 Loading your payslips…</div>;
  if (payslips.length === 0) return <div className="empty">No payslips yet.</div>;

  return (
    <div className="card">
      <div className="card-header"><div className="card-title">Your payslips</div></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Month</th><th>Department</th><th>Net pay</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {payslips.map(p => (
              <tr key={p.id}>
                <td>{p.month_year}</td>
                <td>{p.department || '—'}</td>
                <td>₹{Number(p.net_pay || 0).toLocaleString('en-IN')}</td>
                <td><span className="badge badge-gray">{p.status}</span></td>
                <td>
                  <button className="btn btn-gold btn-sm" disabled={downloadingId === p.id} onClick={() => downloadPdf(p)}>
                    {downloadingId === p.id ? 'Downloading…' : '⬇ PDF'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
