// Turns the client's company name into the URL segment used after login,
// e.g. "ABC Industries Pvt. Ltd." -> "abc-industries-pvt-ltd" (site.com/abc-industries-pvt-ltd).
export function clientSlug(me) {
  const name = me?.company_name || me?.full_name || 'portal';
  const slug = String(name)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'portal';
}

export function storedClientSlug() {
  try { return localStorage.getItem('client_slug') || ''; } catch { return ''; }
}

export function clearClientSession() {
  localStorage.removeItem('client_token');
  localStorage.removeItem('client_user');
  localStorage.removeItem('client_slug');
}
