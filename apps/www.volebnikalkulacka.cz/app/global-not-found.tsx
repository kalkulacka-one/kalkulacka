import "@/app/globals.css";

import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { NotFoundPage, ThemeProvider } from "@/components/client";
import { I18nProvider } from "@/components/server";
import { appConfig } from "@/config/app-config";
import type { ThemeName } from "@/config/themes";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default async function GlobalNotFound() {
  const locale = await getLocale();
  const defaultTheme = appConfig.theme.defaultTheme as ThemeName;

  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale}>
          <ThemeProvider name={defaultTheme}>
            <NotFoundPage />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
