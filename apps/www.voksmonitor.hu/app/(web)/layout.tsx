import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import "../globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { EmbedContextProvider, ThemeProvider } from "../../components/client";
import { PlausibleScript } from "../../components/server";
import { allowCrawling } from "../../lib/seo";

const baseUrl = process.env.NEXT_PUBLIC_CANONICAL_URL || "http://localhost:3000";

type SupportedLocale = "en" | "hu";
type LayoutParams = Promise<Record<string, string | string[] | undefined>>;

function normalizeLocale(value: string | undefined | null): SupportedLocale | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toLowerCase();
  if (normalized === "en" || normalized === "hu") {
    return normalized;
  }

  return undefined;
}

function inferLocaleFromRouteValues(routeValues: Array<string | undefined>): SupportedLocale | undefined {
  for (const value of routeValues) {
    const normalized = value?.toLowerCase();
    if (!normalized) {
      continue;
    }

    if (normalized === "en" || normalized.endsWith("-en")) {
      return "en";
    }

    if (normalized === "hu" || normalized.endsWith("-hu")) {
      return "hu";
    }
  }

  return undefined;
}

function extractRouteValues(params: Record<string, string | string[] | undefined>): string[] {
  return Object.values(params)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value): value is string => typeof value === "string");
}

function inferLocaleFromPathname(pathname: string | null): SupportedLocale | undefined {
  if (!pathname) {
    return undefined;
  }

  const [pathOnly = ""] = pathname.split("?");

  const routeValues = pathOnly
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  return inferLocaleFromRouteValues(routeValues);
}

async function resolveLocale({
  params,
  cookieLocale,
  pathname,
  forcedLocale,
}: {
  params: LayoutParams;
  cookieLocale?: string;
  pathname?: string | null;
  forcedLocale?: string | null;
}): Promise<SupportedLocale> {
  const [resolvedParams, requestLocale] = await Promise.all([params, getLocale()]);

  const routeLocale = inferLocaleFromRouteValues(extractRouteValues(resolvedParams));
  const pathnameLocale = inferLocaleFromPathname(pathname ?? null);
  const forcedLocaleNormalized = normalizeLocale(forcedLocale);
  const localeFromCookie = normalizeLocale(cookieLocale);
  const localeFromRequest = normalizeLocale(requestLocale);

  return forcedLocaleNormalized ?? routeLocale ?? pathnameLocale ?? localeFromCookie ?? localeFromRequest ?? "hu";
}

export async function generateMetadata({ params }: { params: LayoutParams }): Promise<Metadata> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const lang = await resolveLocale({
    params,
    cookieLocale: cookieStore.get("NEXT_LOCALE")?.value,
    pathname: headerStore.get("x-pathname") ?? headerStore.get("next-url"),
    forcedLocale: headerStore.get("x-forced-locale"),
  });
  const isEn = lang === "en";
  return {
    title: {
      default: isEn ? "Voksmonitor" : "Voksmonitor",
      template: isEn ? "%s — Voksmonitor" : "%s — Voksmonitor",
    },
    description: isEn ? "Voksmonitor 2026 - Compare your answers with party positions." : "Voksmonitor 2026 - pártok álláspontjainak összehasonlítása.",
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: isEn ? "Hungarian Parliamentary Elections 2026 Voksmonitor" : "Országgyűlési választások 2026 Voksmonitor",
      description: isEn ? "Voksmonitor 2026 - Compare your answers with party positions." : "Voksmonitor 2026 - pártok álláspontjainak összehasonlítása.",
      url: baseUrl,
      siteName: "Voksmonitor",
      images: [
        {
          url: isEn ? "/og-image-en.png" : "/og-image.png",
          width: 1200,
          height: 630,
          alt: isEn ? "Compare your answers with party positions." : "Voksmonitor 2026 - pártok álláspontjainak összehasonlítása.",
        },
      ],
      locale: isEn ? "en_GB" : "hu_HU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isEn ? "Hungarian Parliamentary Elections 2026 Voksmonitor" : "Országgyűlési választások 2026 Voksmonitor",
      description: isEn ? "Voksmonitor 2026 - Compare your answers with party positions." : "Voksmonitor 2026 - pártok álláspontjainak összehasonlítása.",
      images: ["/og-image.png"],
    },
    robots: {
      index: allowCrawling(),
      follow: allowCrawling(),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children, params }: { children: ReactNode; params: LayoutParams }) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const locale = await resolveLocale({
    params,
    cookieLocale: cookieStore.get("NEXT_LOCALE")?.value,
    pathname: headerStore.get("x-pathname") ?? headerStore.get("next-url"),
    forcedLocale: headerStore.get("x-forced-locale"),
  });

  let messages;
  try {
    messages = await getMessages({ locale });
  } catch {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <PlausibleScript />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Google Tag Manager initialization
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K33BBGX');`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-gray-50">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K33BBGX" height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
        </noscript>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <EmbedContextProvider isEmbed={false}>
            <ThemeProvider name="default">{children}</ThemeProvider>
          </EmbedContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
