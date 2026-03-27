import en from './en.json';
import zh from './zh.json';

const translations: Record<string, any> = { en, zh };

export const supportedLocales = ['en', 'zh'] as const;
export type Locale = typeof supportedLocales[number];

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

export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}

export function getAlternateLocale(locale: string): string {
  return locale === 'en' ? 'zh' : 'en';
}

export function getLocalizedPath(basePath: string, locale: string): string {
  if (basePath === '/' || basePath === '') {
    return `/${locale}/`;
  }
  const path = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return `/${locale}${path}/`;
}

export function getPathWithoutLocale(path: string): string {
  let cleanPath = path.replace(/\/$/, '').replace(/\.html$/, '');
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments[0] === 'en' || segments[0] === 'zh') {
    const rest = segments.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return cleanPath || '/';
}

export function getCurrentLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'zh') return 'zh';
  return 'en';
}
