import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import fil from './locales/fil.json';

const resources = {
  en: {
    translation: en,
  },
  fil: {
    translation: fil,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  })
  .catch(error => {
    console.error('Failed to initialize translations:', error);
  });

export default i18n;
