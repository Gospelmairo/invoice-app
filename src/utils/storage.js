const KEY = 'invoice_app_data';

export function loadInvoices() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveInvoices(invoices) {
  localStorage.setItem(KEY, JSON.stringify(invoices));
}

const THEME_KEY = 'invoice_app_theme';

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
