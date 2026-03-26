import { createContext, useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import zh from '../locales/zh.json';
import es from '../locales/es.json';
import ja from '../locales/ja.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  es: { translation: es },
  ja: { translation: ja },
  de: { translation: de },
  fr: { translation: fr },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps): React.JSX.Element => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true);
    } else {
      i18n.init().then(() => setReady(true));
    }
  }, []);

  if (!ready) {
    return <>{children}</>;
  }

  return <>{children}</>;
};