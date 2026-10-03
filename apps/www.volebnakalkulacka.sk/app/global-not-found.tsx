import "@/app/globals.css";

import { ErrorNotFoundPage } from "@kalkulacka-one/app";
import messages from "@kalkulacka-one/app/locales/sk.json";

import type { Metadata } from "next";

import { ThemeProvider } from "@/components/client";
import { I18nProvider } from "@/components/server";
import { appConfig } from "@/config/app-config";
import type { ThemeName } from "@/config/themes";

const locale = appConfig.i18n.defaultLocale;

export const metadata: Metadata = { title: messages.koa.pages.notFound.heading };

/** Next renders this for a URL that matches no route at all, above every layout, so it brings its own document. */
export default function GlobalNotFound() {
  return (
    <html lang={locale}>
      <body className="min-h-dvh bg-slate-50">
        <I18nProvider locale={locale}>
          <ThemeProvider name={appConfig.theme.defaultTheme as ThemeName}>
            <ErrorNotFoundPage />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
