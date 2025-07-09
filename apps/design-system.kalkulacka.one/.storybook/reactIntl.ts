const locales = ["en", "cs"];

const messages = locales.reduce((acc, lang) => {
  acc[lang] = require(`../../../packages/design-system/src/i18n/${lang}.json`);
  return acc;
}, {});

export const reactIntl = {
  defaultLocale: "en",
  locales,
  messages,
};
