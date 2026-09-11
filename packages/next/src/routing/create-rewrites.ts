import type { PageType } from "@/routing/localized-slugs";
import type { AppConfig } from "@/types/app-config";

export type RewritesConfig = {
  i18n: AppConfig["i18n"];
  pageSlugs: Record<string, Record<PageType, string>>;
  prefixSlugs: Record<string, Record<string, string>>;
  unprefixedCalculatorRoutes?: boolean;
};

export function createRewrites({ i18n, pageSlugs, prefixSlugs, unprefixedCalculatorRoutes = false }: RewritesConfig) {
  const { locales, defaultLocale, localePrefix = "as-needed" } = i18n;

  function validateLocale(locale: string): void {
    if (!locales.includes(locale)) {
      throw new Error(`Invalid locale: "${locale}"`);
    }
  }

  function getPrefixSlug(locale: string, prefixType: string): string {
    const prefixSlug = prefixSlugs[locale]?.[prefixType];
    if (prefixSlug) {
      return prefixSlug;
    }
    throw new Error(`Prefix type "${prefixType}" not found for locale "${locale}".`);
  }

  function getRoutePatterns(locale: string) {
    const electionPrefix = getPrefixSlug(locale, "election");
    return {
      // Web routes (with prefix)
      web1: { prefix: `/${electionPrefix}/:p1`, hasId: ["result"] },
      web2: { prefix: `/${electionPrefix}/:p1/:p2`, hasId: ["result"] },
      web3: { prefix: `/${electionPrefix}/:p1/:p2/:p3`, hasId: ["result"] },
      // Web routes (without prefix - for direct calculator URLs)
      ...(unprefixedCalculatorRoutes && {
        webDirect1: { prefix: "/:p1", hasId: ["result"] },
        webDirect2: { prefix: "/:p1/:p2", hasId: ["result"] },
        webDirect3: { prefix: "/:p1/:p2/:p3", hasId: ["result"] },
      }),
      // Embed routes
      embed1: { prefix: "/embed/:embed/:p1", hasId: [] as string[] },
      embed2: { prefix: "/embed/:embed/:p1/:p2", hasId: [] as string[] },
      embed3: { prefix: "/embed/:embed/:p1/:p2/:p3", hasId: [] as string[] },
    } as const;
  }

  function generateSlugRewrites(fromLocale: string, toLocale: string, prefix: string, hasIdSlugs: readonly string[]) {
    validateLocale(fromLocale);
    validateLocale(toLocale);
    const rewrites: Array<{ source: string; destination: string }> = [];

    const fromSlugs = pageSlugs[fromLocale];
    if (!fromSlugs) {
      throw new Error(`Locale '${fromLocale}' not found in page slugs`);
    }

    // For "as-needed" strategy, default locale doesn't have prefix in source URLs
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

  function getSlugRewrites(fromLocale: string) {
    validateLocale(fromLocale);
    const toLocale = fromLocale;
    const rewrites: Array<{ source: string; destination: string }> = [];
    const routePatterns = getRoutePatterns(fromLocale);

    for (const pattern of Object.values(routePatterns)) {
      rewrites.push(...generateSlugRewrites(fromLocale, toLocale, pattern.prefix, pattern.hasId));
    }

    return rewrites;
  }

  function getLocaleRewrites() {
    validateLocale(defaultLocale);

    if (localePrefix === "as-needed") {
      const electionPrefix = getPrefixSlug(defaultLocale, "election");
      const localesPattern = locales.join("|");

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

  function getLocaleRedirects() {
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

  return { getSlugRewrites, getLocaleRewrites, getLocaleRedirects };
}
