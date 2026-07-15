// api/clientApi.js — talks to vinalaxbackend's /api/client/* routes, which
// proxy straight through to the HR system's API. No data lives here; this
// just handles auth + fetch plumbing for the Company/Employee portal.
const BASE = import.meta.env.VITE_CLIENT_API_URL || 'https://vinalaxbackend.onrender.com/api/client';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.message || 'Request failed.');
  return data;
}

/** Downloads a file (PDF/Excel/ZIP) that requires the auth header, via blob + object URL. */
async function downloadFile(path, token, filename) {
  const res = await fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Download failed.');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const clientApi = {
  login: (email, password) => request('/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/me', { token }),
  changePassword: (token, currentPassword, newPassword) =>
    request('/change-password', { method: 'PUT', token, body: { currentPassword, newPassword } }),

  // Company self-service
  companyPayrolls: (token) => request('/company/payrolls', { token }),
  companyPayrollDetail: (token, runId) => request(`/company/payrolls/${runId}`, { token }),
  downloadCompanyPayrollExcel: (token, runId, filename) =>
    downloadFile(`/company/payrolls/${runId}/excel`, token, filename),

  // Employee self-service
  employeePayslips: (token) => request('/employee/payslips', { token }),
  downloadEmployeePayslipPdf: (token, payslipId, filename) =>
    downloadFile(`/employee/payslips/${payslipId}/pdf`, token, filename)
};
