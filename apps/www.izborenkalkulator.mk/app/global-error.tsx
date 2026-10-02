"use client";

import "@/app/globals.css";

import { ErrorGlobalPage } from "@kalkulacka-one/app/client";

// Imported directly, not through the barrel: this page has to pull in as little as possible.
import { ErrorReporter } from "@/components/client/error-reporter";
// The theme is imported, not mounted through ThemeProvider: that one loads its CSS through
// next/dynamic, and this page cannot depend on a chunk arriving.
import { DefaultTheme } from "@/components/client/themes/default-theme";
import { appConfig } from "@/config/app-config";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang={appConfig.i18n.defaultLocale}>
      <body>
        <ErrorReporter error={error} />
        <DefaultTheme>
          {/* Hardcoded: this page replaces the document, so no i18n provider has run to translate them. */}
          <ErrorGlobalPage
            title="Изборен калкулатор"
            eyebrow="Грешка 500"
            heading="Згрешивме во пресметката"
            paragraph="Калкулаторот не можеше да се вчита. Обидете се да ја освежите страницата."
            reload="Освежи страница"
            home="Назад на почетната"
            reference="Код на грешката"
            digest={error.digest}
          />
        </DefaultTheme>
      </body>
    </html>
  );
}
