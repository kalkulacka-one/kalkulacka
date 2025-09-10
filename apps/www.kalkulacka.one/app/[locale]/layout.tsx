import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import type { I18nParams } from "../i18n/params";
import { routing } from "../i18n/routing";

import "../globals.css";

export async function generateMetadata({ params }: { params: I18nParams }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "layouts.root" });

  return {
    title: "Kalkulacka.1",
    description: t("metadata.description"),
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: I18nParams }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "layouts.root" });

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script defer data-domain="kalkulacka.one" src="/js/script.tagged-events.outbound-links.js" />
      </head>
      <body>
        <main className="p-4 grid gap-8">
          <header className="grid gap-2">
            <Link href={`/${locale}`}>
              <h1 className="text-5xl font-semibold">Kalkulacka.1</h1>
              <p className="text-lg font-medium">
                {t.rich("headline", {
                  em: (chunks) => <em>{chunks}</em>,
                })}
              </p>
            </Link>
            {locale === "cs" && (
              <nav className="flex flex-wrap gap-2">
                <Link href="/cs" className="underline hover:no-underline">
                  Domů
                </Link>
                <Link href="/cs/podporte-kalkulacku" className="underline hover:no-underline">
                  Podpora
                </Link>
                <Link href="/cs/zapojte-se" className="underline hover:no-underline">
                  Dobrovolnictví
                </Link>
                <Link href="/cs/vlastni-kalkulacka" className="underline hover:no-underline">
                  Vlastní kalkulačka
                </Link>
              </nav>
            )}
            <div className="flex flex-wrap gap-2">
              →
              <Link href="https://x.com/kalkulacka_one" className="underline hover:no-underline">
                @kalkulacka_one
              </Link>
            </div>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
