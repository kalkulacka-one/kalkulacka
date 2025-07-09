import { NextIntlClientProvider } from "next-intl";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "../i18n/navigation";
import { routing } from "../i18n/routing";

import "../globals.css";

type Params = Promise<{ locale: string }>;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations("layout");

  return (
    <html lang={locale}>
      <head>
        <script defer data-domain="kalkulacka.one" src="/js/script.tagged-events.outbound-links.js" />
      </head>
      <body>
        <NextIntlClientProvider>
          <main className="p-4 grid gap-8">
            <header className="grid gap-2">
              <Link href="/">
                <h1 className="text-5xl font-semibold">{t("title")}</h1>
                <p className="text-lg font-medium">
                  {t.rich("description", {
                    emphasis: (chunks) => <em>{chunks}</em>,
                  })}
                </p>
              </Link>
              <nav className="flex flex-wrap gap-2">
                <Link href="/" className="underline hover:no-underline">
                  {t("homeLink")}
                </Link>
                <Link href="/podporte-kalkulacku" className="underline hover:no-underline">
                  {t("supportLink")}
                </Link>
                <Link href="/zapojte-se" className="underline hover:no-underline">
                  {t("volunteerLink")}
                </Link>
                <Link href="/vlastni-kalkulacka" className="underline hover:no-underline">
                  {t("customCalculatorLink")}
                </Link>
                {locale === "cs" ? (
                  <Link href="/" locale="en" className="underline hover:no-underline">
                    English 🇬🇧
                  </Link>
                ) : (
                  <Link href="/" locale="cs" className="underline hover:no-underline">
                    Czech 🇨🇿
                  </Link>
                )}
              </nav>
              <div className="flex flex-wrap gap-2">
                →
                <a href="https://x.com/kalkulacka_one" className="underline hover:no-underline">
                  {t("xLink")}
                </a>
              </div>
            </header>
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
