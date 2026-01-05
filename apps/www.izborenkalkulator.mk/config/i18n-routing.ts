import type { Locale } from "next-intl";
import { hasLocale } from "next-intl";

import { routing } from "../i18n/routing";
import { appConfig } from "./app-config";
import { getPrefixSlug, PAGE_SLUGS, type PageType } from "./localized-slugs";

function getRoutePatterns(locale: Locale) {
  const electionPrefix = getPrefixSlug(locale, "election");
  return {
    // Web routes (with prefix)
    web1: { prefix: `/${electionPrefix}/:p1`, hasId: ["result"] },
    web2: { prefix: `/${electionPrefix}/:p1/:p2`, hasId: ["result"] },
    web3: { prefix: `/${electionPrefix}/:p1/:p2/:p3`, hasId: ["result"] },
    // Web routes (without prefix - for direct calculator URLs like /inventura-2023-2025)
    webDirect1: { prefix: "/:p1", hasId: ["result"] },
    webDirect2: { prefix: "/:p1/:p2", hasId: ["result"] },
    webDirect3: { prefix: "/:p1/:p2/:p3", hasId: ["result"] },
    // Embed routes
    embed1: { prefix: "/embed/:embed/:p1", hasId: [] as string[] },
    embed2: { prefix: "/embed/:embed/:p1/:p2", hasId: [] as string[] },
    embed3: { prefix: "/embed/:embed/:p1/:p2/:p3", hasId: [] as string[] },
  } as const;
}

function generateSlugRewrites(fromLocale: Locale, toLocale: Locale, prefix: string, hasIdSlugs: readonly string[]) {
  if (!hasLocale(routing.locales, fromLocale)) {
    throw new Error(`Invalid fromLocale: "${fromLocale}"`);
  }
  if (!hasLocale(routing.locales, toLocale)) {
    throw new Error(`Invalid toLocale: "${toLocale}"`);
  }
  const rewrites: Array<{ source: string; destination: string }> = [];

  const fromSlugs = PAGE_SLUGS[fromLocale];
  if (!fromSlugs) {
    throw new Error(`Locale '${fromLocale}' not found in PAGE_SLUGS`);
  }

  // For "as-needed" strategy, default locale doesn't have prefix in source URLs
  const { defaultLocale, localePrefix } = appConfig.i18n;
  const isDefaultLocale = fromLocale === defaultLocale;
  const sourceLocalePrefix = localePrefix === "as-needed" && isDefaultLocale ? "" : `/${fromLocale}`;

  for (const [pageType, localizedSlug] of Object.entries(fromSlugs)) {
    const filesystemSlug = pageType as PageType;

    rewrites.push({
      source: `${sourceLocalePrefix}${prefix}/${localizedSlug}`,
      destination: `/${toLocale}${prefix}/${filesystemSlug}`,
    });

    if (pageType === "question") {
      rewrites.push({
        source: `${sourceLocalePrefix}${prefix}/${localizedSlug}/:num`,
        destination: `/${toLocale}${prefix}/${filesystemSlug}/:num`,
      });
    }

    if (hasIdSlugs.includes(pageType)) {
      rewrites.push({
        source: `${sourceLocalePrefix}${prefix}/${localizedSlug}/:id`,
        destination: `/${toLocale}${prefix}/${filesystemSlug}/:id`,
      });
    }
  }

  return rewrites;
}

export function getSlugRewrites(fromLocale: Locale) {
  if (!hasLocale(routing.locales, fromLocale)) {
    throw new Error(`Invalid locale: "${fromLocale}"`);
  }
  const toLocale = fromLocale;
  const rewrites: Array<{ source: string; destination: string }> = [];
  const routePatterns = getRoutePatterns(fromLocale);

  for (const pattern of Object.values(routePatterns)) {
    rewrites.push(...generateSlugRewrites(fromLocale, toLocale, pattern.prefix, pattern.hasId));
  }

  return rewrites;
}

export function getLocaleRewrites() {
  const defaultLocale = appConfig.i18n.defaultLocale;

  if (!hasLocale(routing.locales, defaultLocale)) {
    throw new Error(`Invalid default locale \`${defaultLocale}\``);
  }

  const { localePrefix } = appConfig.i18n;

  if (localePrefix === "as-needed") {
    const electionPrefix = getPrefixSlug(defaultLocale, "election");
    const localesPattern = routing.locales.join("|");

    return [
      {
        source: "/",
        destination: `/${defaultLocale}`,
      },
      {
        source: "/embed/:path*",
        destination: `/${defaultLocale}/embed/:path*`,
      },
      {
        source: `/${electionPrefix}/:path*`,
        destination: `/${defaultLocale}/${electionPrefix}/:path*`,
      },
      {
        source: `/:path((?!(?:${localesPattern}|api|_next|favicon\\.ico)(?:/|$)).*)*`,
        destination: `/${defaultLocale}/:path*`,
      },
    ];
  }

  return [];
}

export function getLocaleRedirects() {
  const { defaultLocale, localePrefix } = appConfig.i18n;

  if (localePrefix === "as-needed") {
    return [
      {
        source: `/${defaultLocale}/embed/:path*`,
        destination: "/embed/:path*",
        permanent: true,
      },
      {
        source: `/${defaultLocale}/:path((?!embed).*)*`,
        destination: "/:path*",
        permanent: true,
      },
    ];
  }

  return [];
}
