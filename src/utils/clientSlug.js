// Turns the client's company name into the URL segment used after login,
// e.g. "ABC Industries Pvt. Ltd." -> "abc-industries-pvt-ltd" (site.com/abc-industries-pvt-ltd).
export function clientSlug(me) {
  const name = me?.company_name || me?.full_name || 'portal';
  const slug = String(name)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) return 'portal-home';
  // Never let a company name take over one of the website's own pages
  // (e.g. a company called "Admin" gets /admin-co, not the admin page).
  return RESERVED.has(slug) ? `${slug}-co` : slug;
}

const RESERVED = new Set(['admin', 'login', 'portal', 'services', 'site-api', 'api', 'assets', 'index-html', 'robots-txt', 'sitemap-xml', 'favicon-svg']);

export function storedClientSlug() {
  try { return localStorage.getItem('client_slug') || ''; } catch { return ''; }
}

export function clearClientSession() {
  localStorage.removeItem('client_token');
  localStorage.removeItem('client_user');
  localStorage.removeItem('client_slug');
}
