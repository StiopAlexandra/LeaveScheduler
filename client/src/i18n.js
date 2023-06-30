import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    lng: ['en', 'ro'],
    ns: ['translation'],
    // saveMissing: true,
    // saveMissingTo: "all",
    // keySeparator: false,
    interpolation: {
      escapeValue: false,
      // prefix: '{',
      // suffix: '}',
      defaultVariables: {
        0: '{0}',
        1: '{1}',
        2: '{2}',
        3: '{3}',
        4: '{4}',
        5: '{5}'
      }
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

export default i18n;
