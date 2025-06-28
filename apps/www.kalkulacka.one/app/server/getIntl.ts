"server-only";

import { createIntl } from "react-intl";

// type outside ?

export default async function getIntl(locale: string) {
  return createIntl({
    locale: locale,
    messages: (await import(`../../i18n/${locale}.json`)).default,
    wrapRichTextChunksInFragment: true,
  });
}
