export function getLocaleFromUrl(url: string): string {
  const segments = url.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment === 'zh') return 'zh';
  return 'en';
}

export function getPathForLocale(path: string, locale: string): string {
  const segments = path.split('/').filter(Boolean);
  const currentLocale = segments[0];
  
  if (currentLocale === 'en' || currentLocale === 'zh') {
    segments[0] = locale;
    return '/' + segments.join('/');
  }
  
  if (locale === 'en') {
    return path;
  }
  
  return '/' + locale + path;
}

export function getAlternateLocale(locale: string): string {
  return locale === 'en' ? 'zh' : 'en';
}