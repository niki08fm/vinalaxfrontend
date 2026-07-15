import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientApi } from '/src/api/clientApi.js';
import PortalShell from '/src/components/PortalShell.jsx';
import { Modal, Spinner, Empty, Field, MonthPicker } from '/src/components/PortalUI.jsx';
import { fmtINR, monthLabel } from '/src/utils/portalFormat.js';

function getToken() { return localStorage.getItem('client_token'); }

const RUN_BADGE = { DRAFT: 'vhrp-badge-gray', GENERATED: 'vhrp-badge-blue', APPROVED: 'vhrp-badge-amber', PAID: 'vhrp-badge-green', LOCKED: 'vhrp-badge-gray' };
const PS_BADGE = { GENERATED: 'vhrp-badge-blue', APPROVED: 'vhrp-badge-amber', PAID: 'vhrp-badge-green', ON_HOLD: 'vhrp-badge-gray' };

const TITLES = {
  payrolls: 'Payroll runs', payslips: 'Payslips', password: 'Change password', overview: 'Overview'
};

export default function ClientPortal() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_user');
    navigate('/portal/login');
  }, [navigate]);

  useEffect(() => {
    clientApi.me(getToken())
      .then(d => { setMe(d.user); setTab(d.user.role === 'COMPANY' ? 'payrolls' : 'overview'); })
      .catch(() => { logout(); })
      .finally(() => setLoading(false));
  }, [logout]);

  if (loading || !tab) return <div className="vhrp-root"><div className="vhrp-empty"><Spinner large /><div style={{ marginTop: 8 }}>Loading your portal…</div></div></div>;
  if (!me) return null;

  return (
    <PortalShell me={me} title={TITLES[tab]} tab={tab} onTabChange={setTab}>
      {me.role === 'COMPANY'
        ? (tab === 'payrolls' ? <PayrollsTab /> : tab === 'payslips' ? <PayslipsTab /> : <ChangePasswordTab />)
        : (tab === 'overview' ? <OverviewTab me={me} onGoPayslips={() => setTab('payslips')} /> : tab === 'payslips' ? <MyPayslipsTab /> : <ChangePasswordTab />)}
    </PortalShell>
  );
}

/* ════════════════════════════════════════════════════════════════
   COMPANY: Payroll runs tab
═══════════════════════════════════════════════════════════════════ */
function PayrollsTab() {
  const [monthYear, setMonthYear] = useState('');
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);
  const [viewRun, setViewRun] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRuns((await clientApi.companyPayrolls(getToken(), monthYear || undefined)).runs || []); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [monthYear]);

  useEffect(() => { load(); }, [load]);

  const downloadExcel = async (r) => {
    setDownloading(r.id);
    try { await clientApi.downloadCompanyPayrollExcel(getToken(), r.id, `Payroll_${r.month_year}.xlsx`); }
    catch (err) { setError(err.message); }
    finally { setDownloading(null); }
  };

  return (
    <>
      {error && <div className="vhrp-alert vhrp-alert-error vhrp-mb">⚠️ {error}</div>}
      <div className="vhrp-card vhrp-card-pad vhrp-mb">
        <div className="vhrp-row" style={{ flexWrap: 'wrap' }}>
          <MonthPicker value={monthYear} onChange={setMonthYear} />
          <span className="vhrp-muted" style={{ fontSize: '0.82rem' }}>
            {runs.length} payroll run{runs.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {loading ? <div className="vhrp-card vhrp-card-pad" style={{ textAlign: 'center' }}><Spinner large /></div>
        : runs.length === 0
          ? <div className="vhrp-card"><Empty icon="▥" title="No payroll runs">No payrolls for the selected period.</Empty></div>
          : (
            <div className="vhrp-card">
              <div className="vhrp-table-wrap">
                <table className="vhrp-table">
                  <thead>
                    <tr>
                      <th>Month</th><th className="vhrp-num">Employees</th><th className="vhrp-num">Gross</th>
                      <th className="vhrp-num">Net pay</th><th className="vhrp-num">PF</th><th className="vhrp-num">ESI</th>
                      <th className="vhrp-num">TDS</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map(r => (
                      <tr key={r.id}>
                        <td><b>{monthLabel(r.month_year)}</b></td>
                        <td className="vhrp-num vhrp-mono">{r.employee_count}</td>
                        <td className="vhrp-num vhrp-mono">{fmtINR(r.total_gross)}</td>
                        <td className="vhrp-num vhrp-mono"><b>{fmtINR(r.total_net)}</b></td>
                        <td className="vhrp-num vhrp-mono">{fmtINR(r.total_pf)}</td>
                        <td className="vhrp-num vhrp-mono">{fmtINR(r.total_esi)}</td>
                        <td className="vhrp-num vhrp-mono">{fmtINR(r.total_tds)}</td>
                        <td><span className={`vhrp-badge ${RUN_BADGE[r.status] || 'vhrp-badge-gray'}`}>{r.status}</span></td>
                        <td className="vhrp-text-right">
                          <div className="vhrp-row vhrp-gap-sm" style={{ justifyContent: 'flex-end' }}>
                            <button className="vhrp-btn vhrp-btn-ghost vhrp-btn-sm" onClick={() => setViewRun(r.id)}>View</button>
                            <button className="vhrp-btn vhrp-btn-ghost vhrp-btn-sm" onClick={() => downloadExcel(r)} disabled={downloading === r.id}>
                              {downloading === r.id ? '…' : '⬇ Excel'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

      <PayrollDetailModal runId={viewRun} onClose={() => setViewRun(null)} />
    </>
  );
}

function PayrollDetailModal({ runId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (!runId) { setData(null); return; }
    setLoading(true);
    clientApi.companyPayrollDetail(getToken(), runId)
      .then(d => setData(d))
      .catch(err => { setError(err.message); onClose(); })
      .finally(() => setLoading(false));
  }, [runId]); // eslint-disable-line

  const downloadPdf = async (p) => {
    setDownloading(p.id);
    try { await clientApi.downloadCompanyPayslipPdf(getToken(), p.id, `Payslip_${p.full_name}_${data.run.month_year}.pdf`); }
    catch (err) { setError(err.message); }
    finally { setDownloading(null); }
  };

  const run = data?.run;
  const payslips = data?.payslips || [];

  return (
    <Modal open={!!runId} onClose={onClose} title={run ? `Payroll — ${monthLabel(run.month_year)}` : 'Payroll detail'} width={860}>
      {error && <div className="vhrp-alert vhrp-alert-error vhrp-mb">⚠️ {error}</div>}
      {loading || !run ? <div style={{ textAlign: 'center', padding: 40 }}><Spinner large /></div> : (
        <>
          <div className="vhrp-dash-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {[['Employees', run.employee_count], ['Gross', fmtINR(run.total_gross)], ['Net pay', fmtINR(run.total_net)], ['TDS', fmtINR(run.total_tds)]].map(([l, v]) => (
              <div key={l} className="vhrp-stat" style={{ padding: '12px 16px' }}>
                <div className="vhrp-stat-label">{l}</div>
                <div className="vhrp-stat-value" style={{ fontSize: '1.1rem' }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="vhrp-table-wrap" style={{ maxHeight: 340, overflowY: 'auto' }}>
            <table className="vhrp-table">
              <thead><tr><th>Employee</th><th className="vhrp-num">Earnings</th><th className="vhrp-num">Deductions</th><th className="vhrp-num">Net pay</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {payslips.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.full_name}</div>
                      <div className="vhrp-muted vhrp-mono" style={{ fontSize: '0.72rem' }}>{p.employee_number}{p.department ? ` · ${p.department}` : ''}</div>
                    </td>
                    <td className="vhrp-num vhrp-mono">{fmtINR(p.total_earnings)}</td>
                    <td className="vhrp-num vhrp-mono">{fmtINR(p.total_deductions)}</td>
                    <td className="vhrp-num vhrp-mono"><b>{fmtINR(p.net_pay)}</b></td>
                    <td><span className={`vhrp-badge ${PS_BADGE[p.status] || 'vhrp-badge-gray'}`}>{p.status}</span></td>
                    <td className="vhrp-text-right">
                      <button className="vhrp-btn vhrp-btn-navy vhrp-btn-sm" onClick={() => downloadPdf(p)} disabled={downloading === p.id}>
                        {downloading === p.id ? '…' : '⬇ PDF'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   COMPANY: Payslips tab (search, PDF, ZIP, PF-ECR/ESI/Bank reports)
═══════════════════════════════════════════════════════════════════ */
function PayslipsTab() {
  const [monthYear, setMonthYear] = useState('');
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [pfBusy, setPfBusy] = useState(false);
  const [esiBusy, setEsiBusy] = useState(false);
  const [bankBusy, setBankBusy] = useState(false);
  const [viewPayslip, setViewPayslip] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setPayslips((await clientApi.companyPayslips(getToken(), monthYear || undefined)).payslips || []); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [monthYear]);

  useEffect(() => { load(); }, [load]);

  const filtered = search.trim()
    ? payslips.filter(p =>
        p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.employee_number?.toLowerCase().includes(search.toLowerCase()) ||
        p.department?.toLowerCase().includes(search.toLowerCase()))
    : payslips;

  const downloadPdf = async (p) => {
    setDownloadingPdf(p.id);
    try { await clientApi.downloadCompanyPayslipPdf(getToken(), p.id, `Payslip_${p.full_name}_${p.month_year}.pdf`); }
    catch (err) { setError(err.message); }
    finally { setDownloadingPdf(null); }
  };

  const downloadZip = async () => {
    if (!monthYear) return setError('Select a month to download bulk payslips.');
    setDownloadingZip(true);
    try { await clientApi.downloadCompanyPayslipsZip(getToken(), monthYear, `Payslips_${monthYear}.zip`); }
    catch (err) { setError(err.message); }
    finally { setDownloadingZip(false); }
  };

  const downloadReport = async (kind) => {
    if (!monthYear) return setError('Select a month first.');
    const setBusy = kind === 'pf-ecr' ? setPfBusy : kind === 'esi' ? setEsiBusy : setBankBusy;
    const fn = kind === 'pf-ecr' ? clientApi.downloadCompanyPfEcrReport : kind === 'esi' ? clientApi.downloadCompanyEsiReport : clientApi.downloadCompanyBankReport;
    setBusy(true);
    try { await fn(getToken(), monthYear, `${kind.toUpperCase()}_${monthYear}.xlsx`); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <>
      {error && <div className="vhrp-alert vhrp-alert-error vhrp-mb">⚠️ {error}</div>}
      <div className="vhrp-card vhrp-card-pad vhrp-mb">
        <div className="vhrp-row" style={{ flexWrap: 'wrap' }}>
          <MonthPicker value={monthYear} onChange={setMonthYear} />
          <input className="vhrp-input vhrp-flex-1" style={{ minWidth: 180 }} placeholder="Search name, employee number, department…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <span className="vhrp-muted" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
            {filtered.length} payslip{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        {payslips.length > 0 && (
          <div className="vhrp-row" style={{ flexWrap: 'wrap', marginTop: '0.75rem' }}>
            <button className="vhrp-btn vhrp-btn-ghost vhrp-btn-sm" onClick={() => downloadReport('pf-ecr')} disabled={pfBusy}>
              {pfBusy ? 'Generating…' : '⬇ PF ECR Report'}
            </button>
            <button className="vhrp-btn vhrp-btn-ghost vhrp-btn-sm" onClick={() => downloadReport('esi')} disabled={esiBusy}>
              {esiBusy ? 'Generating…' : '⬇ ESI Report'}
            </button>
            <button className="vhrp-btn vhrp-btn-ghost vhrp-btn-sm" onClick={() => downloadReport('bank')} disabled={bankBusy}>
              {bankBusy ? 'Generating…' : '⬇ Bank Report'}
            </button>
            <button className="vhrp-btn vhrp-btn-ghost vhrp-btn-sm" onClick={downloadZip} disabled={downloadingZip}>
              {downloadingZip ? 'Downloading…' : '⬇ ZIP (all payslips)'}
            </button>
          </div>
        )}
      </div>

      {loading ? <div className="vhrp-card vhrp-card-pad" style={{ textAlign: 'center' }}><Spinner large /></div>
        : filtered.length === 0
          ? <div className="vhrp-card"><Empty icon="▥" title="No payslips">No payslips for the selected period.</Empty></div>
          : (
            <div className="vhrp-card">
              <div className="vhrp-table-wrap">
                <table className="vhrp-table">
                  <thead>
                    <tr>
                      <th>Employee</th><th>Month</th><th className="vhrp-num">Earnings</th>
                      <th className="vhrp-num">Deductions</th><th className="vhrp-num">Net pay</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.full_name}</div>
                          <div className="vhrp-muted vhrp-mono" style={{ fontSize: '0.72rem' }}>{p.employee_number}{p.department ? ` · ${p.department}` : ''}</div>
                        </td>
                        <td>{monthLabel(p.month_year)}</td>
                        <td className="vhrp-num vhrp-mono">{fmtINR(p.total_earnings)}</td>
                        <td className="vhrp-num vhrp-mono">{fmtINR(p.total_deductions)}</td>
                        <td className="vhrp-num vhrp-mono"><b>{fmtINR(p.net_pay)}</b></td>
                        <td><span className={`vhrp-badge ${PS_BADGE[p.status] || 'vhrp-badge-gray'}`}>{p.status === 'ON_HOLD' ? 'On hold' : p.status}</span></td>
                        <td className="vhrp-text-right">
                          <div className="vhrp-row vhrp-gap-sm" style={{ justifyContent: 'flex-end' }}>
                            <button className="vhrp-btn vhrp-btn-ghost vhrp-btn-sm" onClick={() => setViewPayslip(p.id)}>View</button>
                            <button className="vhrp-btn vhrp-btn-navy vhrp-btn-sm" onClick={() => downloadPdf(p)} disabled={downloadingPdf === p.id}>
                              {downloadingPdf === p.id ? '…' : '⬇ PDF'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

      <PayslipDetailModal payslipId={viewPayslip} onClose={() => setViewPayslip(null)} isCompany />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Payslip detail modal (shared by company + employee views)
═══════════════════════════════════════════════════════════════════ */
function PayslipDetailModal({ payslipId, onClose, isCompany }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!payslipId) { setData(null); return; }
    setLoading(true);
    const fetcher = isCompany ? clientApi.companyPayslipDetail(getToken(), payslipId) : clientApi.employeePayslips(getToken());
    fetcher
      .then(d => setData(isCompany ? d : { payslip: (d.payslips || []).find(p => p.id === payslipId), components: [] }))
      .catch(err => { setError(err.message); onClose(); })
      .finally(() => setLoading(false));
  }, [payslipId]); // eslint-disable-line

  const p = data?.payslip;
  const components = data?.components || [];
  const allowances = components.filter(c => ['ALLOWANCE', 'ADHOC_ALLOWANCE', 'ARREAR', 'OT'].includes(c.component_type));
  const deductions = components.filter(c => ['DEDUCTION', 'ADHOC_DEDUCTION', 'CONTRIBUTION'].includes(c.component_type));

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      if (isCompany) await clientApi.downloadCompanyPayslipPdf(getToken(), payslipId, `Payslip_${p?.full_name}_${p?.month_year}.pdf`);
      else await clientApi.downloadEmployeePayslipPdf(getToken(), payslipId, `Payslip_${p?.month_year}.pdf`);
    } catch (err) { setError(err.message); }
    finally { setDownloading(false); }
  };

  return (
    <Modal open={!!payslipId} onClose={onClose}
      title={p ? `Payslip · ${monthLabel(p.month_year)}` : 'Payslip'}
      width={680}
      footer={p && (
        <button className="vhrp-btn vhrp-btn-navy" onClick={downloadPdf} disabled={downloading}>
          {downloading ? 'Downloading…' : '⬇ Download PDF'}
        </button>
      )}>
      {error && <div className="vhrp-alert vhrp-alert-error vhrp-mb">⚠️ {error}</div>}
      {loading || !p ? <div style={{ textAlign: 'center', padding: 40 }}><Spinner large /></div> : (
        <>
          <div className="vhrp-row-between vhrp-mb">
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{p.full_name || ''}</div>
              <div className="vhrp-muted" style={{ fontSize: '0.8rem' }}>{p.employee_number}{p.department ? ` · ${p.department}` : ''}</div>
            </div>
            <div className="vhrp-text-right">
              <div className="vhrp-muted" style={{ fontSize: '0.72rem' }}>NET PAY</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--vhrp-green)' }}>{fmtINR(p.net_pay)}</div>
              <span className={`vhrp-badge ${PS_BADGE[p.status] || 'vhrp-badge-gray'}`}>{p.status}</span>
            </div>
          </div>

          <div className="vhrp-dash-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {[['Payable days', p.payable_days], ['LOP days', p.lop_days || 0], ['Gross earned', fmtINR(p.gross_earned)], ['TDS', fmtINR(p.tds_amount)]].map(([l, v]) => (
              <div key={l} className="vhrp-stat" style={{ padding: '10px 14px' }}>
                <div className="vhrp-stat-label" style={{ fontSize: '0.72rem' }}>{l}</div>
                <div className="vhrp-stat-value" style={{ fontSize: '1rem' }}>{v}</div>
              </div>
            ))}
          </div>

          {components.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div className="vhrp-row-between" style={{ padding: '8px 0', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--vhrp-navy)', letterSpacing: '0.05em' }}>Earnings</span>
                  <span className="vhrp-muted" style={{ fontSize: '0.78rem' }}>{fmtINR(p.total_earnings)}</span>
                </div>
                <table className="vhrp-table" style={{ fontSize: '0.82rem' }}>
                  <tbody>{allowances.map(c => <tr key={c.component_name}><td>{c.component_name}</td><td className="vhrp-num vhrp-mono">{fmtINR(c.earned_amount)}</td></tr>)}</tbody>
                </table>
              </div>
              <div>
                <div className="vhrp-row-between" style={{ padding: '8px 0', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--vhrp-navy)', letterSpacing: '0.05em' }}>Deductions</span>
                  <span className="vhrp-muted" style={{ fontSize: '0.78rem' }}>{fmtINR(p.total_deductions)}</span>
                </div>
                <table className="vhrp-table" style={{ fontSize: '0.82rem' }}>
                  <tbody>
                    {deductions.map(c => <tr key={c.component_name}><td>{c.component_name}</td><td className="vhrp-num vhrp-mono">{fmtINR(c.earned_amount)}</td></tr>)}
                    {p.tds_amount > 0 && <tr><td>TDS</td><td className="vhrp-num vhrp-mono">{fmtINR(p.tds_amount)}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   EMPLOYEE: Overview tab
═══════════════════════════════════════════════════════════════════ */
function OverviewTab({ me, onGoPayslips }) {
  const [latest, setLatest] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientApi.employeePayslips(getToken())
      .then(d => { const list = d.payslips || []; setCount(list.length); setLatest(list[0] || null); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="vhrp-page-head">
        <div>
          <span className="vhrp-eyebrow">My space</span>
          <h2 className="vhrp-page-title">Welcome, {me?.full_name || 'there'}</h2>
          <p className="vhrp-page-sub">Your payslips and pay summary.</p>
        </div>
      </div>

      {loading ? <div className="vhrp-card vhrp-card-pad" style={{ textAlign: 'center' }}><Spinner large /></div> : (
        <div className="vhrp-dash-cols">
          <div className="vhrp-card">
            <div className="vhrp-card-head"><h3 className="vhrp-card-title">Latest payslip</h3></div>
            <div className="vhrp-card-pad">
              {latest ? (
                <>
                  <div className="vhrp-row-between vhrp-mb">
                    <div>
                      <div className="vhrp-display" style={{ fontSize: '1.3rem', color: 'var(--vhrp-navy)' }}>{monthLabel(latest.month_year)}</div>
                      <span className={`vhrp-badge ${latest.status === 'PAID' ? 'vhrp-badge-green' : 'vhrp-badge-amber'}`}>{latest.status}</span>
                    </div>
                    <div className="vhrp-text-right">
                      <div className="vhrp-muted" style={{ fontSize: '0.72rem' }}>NET PAY</div>
                      <div className="vhrp-display" style={{ fontSize: '1.6rem', color: 'var(--vhrp-green)' }}>{fmtINR(latest.net_pay)}</div>
                    </div>
                  </div>
                  <button className="vhrp-btn vhrp-btn-navy" onClick={onGoPayslips}>View all payslips →</button>
                </>
              ) : <Empty icon="▥" title="No payslips yet">Your payslips appear here once payroll is approved.</Empty>}
            </div>
          </div>

          <div className="vhrp-card">
            <div className="vhrp-card-head"><h3 className="vhrp-card-title">Summary</h3></div>
            <div className="vhrp-card-pad">
              <div className="vhrp-stat" style={{ border: 'none', padding: 0 }}>
                <div className="vhrp-stat-label">Payslips available</div>
                <div className="vhrp-stat-value">{count}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   EMPLOYEE: My payslips tab
═══════════════════════════════════════════════════════════════════ */
function MyPayslipsTab() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);
  const [viewPayslip, setViewPayslip] = useState(null);

  useEffect(() => {
    clientApi.employeePayslips(getToken())
      .then(d => setPayslips(d.payslips || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const download = async (p) => {
    setDownloading(p.id);
    try { await clientApi.downloadEmployeePayslipPdf(getToken(), p.id, `Payslip_${p.month_year}.pdf`); }
    catch (err) { setError(err.message); }
    finally { setDownloading(null); }
  };

  return (
    <>
      {error && <div className="vhrp-alert vhrp-alert-error vhrp-mb">⚠️ {error}</div>}
      {loading ? <div className="vhrp-card vhrp-card-pad" style={{ textAlign: 'center' }}><Spinner large /></div>
        : payslips.length === 0 ? <div className="vhrp-card"><Empty icon="▥" title="No payslips yet">They appear once your payroll is approved.</Empty></div>
        : (
          <div className="vhrp-card">
            <div className="vhrp-table-wrap">
              <table className="vhrp-table">
                <thead><tr><th>Month</th><th className="vhrp-num">Earnings</th><th className="vhrp-num">Deductions</th><th className="vhrp-num">Net pay</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {payslips.map(p => (
                    <tr key={p.id}>
                      <td><b>{monthLabel(p.month_year)}</b></td>
                      <td className="vhrp-num vhrp-mono">{fmtINR(p.total_earnings)}</td>
                      <td className="vhrp-num vhrp-mono">{fmtINR(p.total_deductions)}</td>
                      <td className="vhrp-num vhrp-mono"><b>{fmtINR(p.net_pay)}</b></td>
                      <td><span className={`vhrp-badge ${p.status === 'PAID' ? 'vhrp-badge-green' : 'vhrp-badge-amber'}`}>{p.status}</span></td>
                      <td className="vhrp-text-right">
                        <div className="vhrp-row vhrp-gap-sm" style={{ justifyContent: 'flex-end' }}>
                          <button className="vhrp-btn vhrp-btn-ghost vhrp-btn-sm" onClick={() => setViewPayslip(p.id)}>View</button>
                          <button className="vhrp-btn vhrp-btn-navy vhrp-btn-sm" onClick={() => download(p)} disabled={downloading === p.id}>
                            {downloading === p.id ? '…' : '⬇ PDF'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      <PayslipDetailModal payslipId={viewPayslip} onClose={() => setViewPayslip(null)} isCompany={false} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Change password tab (shared)
═══════════════════════════════════════════════════════════════════ */
function ChangePasswordTab() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mismatch = next && confirm && next !== confirm;
  const canSubmit = current && next.length >= 8 && next === confirm;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true); setError(''); setSuccess('');
    try {
      await clientApi.changePassword(getToken(), current, next);
      setSuccess('Password changed successfully.');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="vhrp-card vhrp-card-pad" style={{ maxWidth: 480 }}>
      <h3 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--vhrp-navy)' }}>Change password</h3>
      {error && <div className="vhrp-alert vhrp-alert-error vhrp-mb">⚠️ {error}</div>}
      {success && <div className="vhrp-alert vhrp-alert-success vhrp-mb">✓ {success}</div>}
      <form onSubmit={submit}>
        <Field label="Current password" required>
          <input className="vhrp-input" type="password" value={current} onChange={e => setCurrent(e.target.value)} placeholder="Enter your current password" autoComplete="current-password" />
        </Field>
        <Field label="New password" required hint="Minimum 8 characters">
          <input className="vhrp-input" type="password" value={next} onChange={e => setNext(e.target.value)} placeholder="Enter new password" autoComplete="new-password" />
        </Field>
        <Field label="Confirm new password" required hint={mismatch ? '⚠ Passwords do not match' : ''}>
          <input className="vhrp-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter new password" autoComplete="new-password" />
        </Field>
        <div style={{ marginTop: 24 }}>
          <button className="vhrp-btn vhrp-btn-gold" type="submit" disabled={busy || !canSubmit}>
            {busy ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  );
}
