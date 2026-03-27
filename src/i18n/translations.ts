import en from './en.json';
import zh from './zh.json';

const translations: Record<string, any> = { en, zh };

export function t(locale: string, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export function getTranslations(locale: string): Record<string, any> {
  return translations[locale] || translations.en;
}

export const supportedLocales = ['en', 'zh'] as const;
export type Locale = typeof supportedLocales[number];

export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}

export function getAlternateLocale(locale: string): string {
  return locale === 'en' ? 'zh' : 'en';
}

export function getLocalizedPath(basePath: string, locale: string): string {
  // Both EN and ZH use .html file format
  // Astro build outputs: /en.html, /zh.html, /en/about.html, /zh/about.html, etc.
  const path = basePath === '/' ? '' : basePath;
  
  if (locale === 'en') {
    return `/en${path ? path + '.html' : '.html'}`;
  } else {
    return `/zh${path ? path + '.html' : '.html'}`;
  }
}

export function getPathWithoutLocale(path: string): string {
  // Handle locale root pages (/en.html, /zh.html)
  if (path === '/en.html') return '/';
  if (path === '/zh.html') return '/';
  
  // Remove trailing slash
  let cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
  
  const segments = cleanPath.split('/').filter(Boolean);
  
  // Remove locale prefix if present
  if (segments[0] === 'en' || segments[0] === 'zh') {
    return '/' + segments.slice(1).join('/');
  }
  
  return cleanPath || '/';
}

export function getCurrentLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'zh') return 'zh';
  return 'en';
}