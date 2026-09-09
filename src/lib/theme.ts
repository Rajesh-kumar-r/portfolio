export type Theme = 'light' | 'dark';

/** Resolve the active theme: explicit localStorage choice, else prefers-color-scheme. */
export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch (e) {
    return 'dark';
  }
}

/** Reflect a theme onto <html> (dark = attribute absent). */
export function applyTheme(t: Theme): void {
  if (t === 'light') {
    document.documentElement.dataset.theme = 'light';
  } else {
    delete document.documentElement.dataset.theme;
  }
}

/** Flip the current theme, persist the choice, return the new value. */
export function toggleTheme(): Theme {
  const current: Theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  const next: Theme = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {
    /* storage unavailable — in-memory flip still applied */
  }
  return next;
}
