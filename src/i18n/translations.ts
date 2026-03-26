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
  // Astro build format: 
  // - EN pages are in /en/ directory with index.html
  // - ZH pages are .html files at root (zh.html, zh/tools.html)
  const path = basePath === '/' ? '' : basePath;
  
  if (locale === 'en') {
    // EN uses directory format with index.html
    return `/en${path || '/'}`;
  } else {
    // ZH uses .html file format (no index.html in /zh/)
    const htmlFile = path ? `/zh${path}.html` : '/zh.html';
    return htmlFile;
  }
}

export function getPathWithoutLocale(path: string): string {
  const segments = path.split('/').filter(Boolean);
  if (segments[0] === 'en' || segments[0] === 'zh') {
    return '/' + segments.slice(1).join('/');
  }
  return path;
}

export function getCurrentLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'zh') return 'zh';
  return 'en';
}