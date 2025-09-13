import type { Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { StructuredData } from "../../components/structured-data";
import type { I18nParams } from "../i18n/params";
import { routing } from "../i18n/routing";

import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: I18nParams }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "layouts.root" });

  const baseUrl = "https://www.kalkulacka.one";
  const canonicalUrl = `${baseUrl}/${locale}`;

  return {
    title: {
      default: "Kalkulacka.1 — Multi-country Voting Advice Platform",
      template: "%s — Kalkulacka.1",
    },
    description: t("metadata.description"),
    keywords: [
      "voting advice application",
      "election calculator",
      "political compass",
      "democracy",
      "elections",
      locale === "cs" ? "volby" : "elections",
      locale === "cs" ? "volební kalkulačka" : "voting calculator",
    ],
    authors: [{ name: "Kalkulacka.1 Team" }],
    creator: "Kalkulacka.1",
    publisher: "Kalkulacka.1",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        cs: `${baseUrl}/cs`,
        en: `${baseUrl}/en`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: "Kalkulacka.1 — Multi-country Voting Advice Platform",
      description: t("metadata.description"),
      url: canonicalUrl,
      siteName: "Kalkulacka.1",
      images: [
        {
          url: "/og-kalkulacka-one.png",
          width: 1200,
          height: 630,
          alt: "Kalkulacka.1 - Voting Advice Applications",
        },
      ],
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@kalkulacka_one",
      creator: "@kalkulacka_one",
      title: "Kalkulacka.1 — Multi-country Voting Advice Platform",
      description: t("metadata.description"),
      images: ["/og-kalkulacka-one.png"],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    verification: {
      google: "google-site-verification-token-here",
    },
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
        <script defer data-domain="kalkulacka.one" src="/js/script.tagged-events.outbound-links.js" />
        <StructuredData locale={locale} />
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
