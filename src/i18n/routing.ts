export const locales = ['th', 'en', 'vi'] as const;
export const defaultLocale = 'th';

export type Locale = (typeof locales)[number];

export const routing = {
  locales,
  defaultLocale,
  pathnames: {
    '/': '/',
    '/download': '/download',
    '/features': '/features',
    '/compare': '/compare',
    '/business': '/business',
    '/support': '/support',
    '/privacy': '/privacy',
    '/linux': '/linux',
    '/compare/chrome': '/compare/chrome',
    '/compare/firefox': '/compare/firefox',
    '/compare/google': '/compare/google',
    '/compare/duckduckgo': '/compare/duckduckgo',
    '/compare/safari': '/compare/safari',
    '/compare/edge': '/compare/edge'
  }
} as const;