// utils/portalFormat.js — shared formatting helpers for the Client Portal.

export function fmtINR(value, { decimals = 2 } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '₹0.00';
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

// '2026-06' → 'June 2026'
export function monthLabel(monthYear) {
  if (!monthYear || !/^\d{4}-\d{2}$/.test(monthYear)) return monthYear || '—';
  const [y, m] = monthYear.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

export function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
}
