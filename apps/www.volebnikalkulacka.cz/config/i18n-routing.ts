import { appConfig } from "./app-config";
import { BLOCKED_ENGLISH_SLUGS, getPrefixSlug, PAGE_SLUGS, type PageType } from "./localized-slugs";

function getRoutePatterns(locale: string) {
  const electionPrefix = getPrefixSlug(locale, "election");
  return {
    // Web routes
    web1: { prefix: `/${electionPrefix}/:p1`, hasId: ["result"] },
    web2: { prefix: `/${electionPrefix}/:p1/:p2`, hasId: ["result"] },
    web3: { prefix: `/${electionPrefix}/:p1/:p2/:p3`, hasId: ["result"] },
    // Embed routes
    embed1: { prefix: "/embed/:embed/:p1", hasId: [] as string[] },
    embed2: { prefix: "/embed/:embed/:p1/:p2", hasId: [] as string[] },
    embed3: { prefix: "/embed/:embed/:p1/:p2/:p3", hasId: [] as string[] },
  } as const;
}

function generateSlugRewrites(fromLocale: string, toLocale: string, prefix: string, hasIdSlugs: readonly string[]) {
  const rewrites: Array<{ source: string; destination: string }> = [];

  const fromSlugs = PAGE_SLUGS[fromLocale];
  if (!fromSlugs) {
    throw new Error(`Locale '${fromLocale}' not found in PAGE_SLUGS`);
  }

  for (const [pageType, localizedSlug] of Object.entries(fromSlugs)) {
    const filesystemSlug = pageType as PageType; // English filesystem route

    // Base rewrite: /prefix/localizedSlug → /toLocale/prefix/filesystemSlug
    rewrites.push({
      source: `${prefix}/${localizedSlug}`,
      destination: `/${toLocale}${prefix}/${filesystemSlug}`,
    });

    // Question has :num param
    if (pageType === "question") {
      rewrites.push({
        source: `${prefix}/${localizedSlug}/:num`,
        destination: `/${toLocale}${prefix}/${filesystemSlug}/:num`,
      });
    }

    // Result can have :id param for public results
    if (hasIdSlugs.includes(pageType)) {
      rewrites.push({
        source: `${prefix}/${localizedSlug}/:id`,
        destination: `/${toLocale}${prefix}/${filesystemSlug}/:id`,
      });
    }
  }

  return rewrites;
}

/**
 * Generate slug rewrites for a specific locale (localized URLs → English routes).
 */
export function getSlugRewrites(fromLocale: string) {
  const { defaultLocale } = appConfig.i18n;
  const rewrites: Array<{ source: string; destination: string }> = [];
  const routePatterns = getRoutePatterns(fromLocale);

  for (const pattern of Object.values(routePatterns)) {
    rewrites.push(...generateSlugRewrites(fromLocale, defaultLocale, pattern.prefix, pattern.hasId));
  }

  return rewrites;
}

/**
 * Generate rewrites that map root paths to default locale paths.
 * Used when localePrefix is "as-needed".
 */
export function getLocaleRewrites() {
  const { defaultLocale, localePrefix } = appConfig.i18n;

  if (localePrefix === "as-needed") {
    const electionPrefix = getPrefixSlug(defaultLocale, "election");
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
        source: "/:path*",
        destination: `/${defaultLocale}/:path*`,
      },
    ];
  }

  return [];
}

/**
 * Generate redirects that remove default locale prefix from URLs.
 * Used when localePrefix is "as-needed".
 */
export function getLocaleRedirects() {
  const { defaultLocale, localePrefix } = appConfig.i18n;

  if (localePrefix === "as-needed") {
    return [
      {
        source: `/${defaultLocale}/embed/:path*`,
        destination: "/embed/:path*",
        permanent: false,
      },
      {
        source: `/${defaultLocale}/:path((?!embed).*)*`,
        destination: "/:path*",
        permanent: false,
      },
    ];
  }

  return [];
}

/**
 * Generate rewrites that send English slug URLs to a non-existent path (404).
 * This prevents English URLs from working on the Czech app.
 */
function generateEnglishSlug404Rewrites(prefix: string, hasIdSlugs: readonly string[]) {
  const rewrites: Array<{ source: string; destination: string }> = [];
  const { defaultLocale } = appConfig.i18n;

  const czechSlugs = PAGE_SLUGS[defaultLocale];
  if (!czechSlugs) {
    return rewrites;
  }

  // Iterate over PageTypes, treating them as the English slugs (filesystem routes)
  for (const pageType of BLOCKED_ENGLISH_SLUGS) {
    const englishSlug = pageType; // English slug = filesystem route = PageType
    const czechSlug = czechSlugs[pageType as PageType];

    // Skip if English and Czech slugs are the same (no need to block)
    if (englishSlug === czechSlug) continue;

    // Base rewrite: /prefix/englishSlug → /__404__
    rewrites.push({
      source: `${prefix}/${englishSlug}`,
      destination: "/__invalid_route_404__",
    });

    // Question has :num param
    if (pageType === "question") {
      rewrites.push({
        source: `${prefix}/${englishSlug}/:num`,
        destination: "/__invalid_route_404__",
      });
    }

    // Result can have :id param
    if (hasIdSlugs.includes(pageType)) {
      rewrites.push({
        source: `${prefix}/${englishSlug}/:id`,
        destination: "/__invalid_route_404__",
      });
    }
  }

  return rewrites;
}

/**
 * Generate all English slug 404 rewrites.
 * These must come BEFORE the fallback locale rewrites.
 */
export function getEnglishSlug404Rewrites() {
  const { defaultLocale } = appConfig.i18n;
  const rewrites: Array<{ source: string; destination: string }> = [];
  const routePatterns = getRoutePatterns(defaultLocale);

  for (const pattern of Object.values(routePatterns)) {
    rewrites.push(...generateEnglishSlug404Rewrites(pattern.prefix, pattern.hasId));
  }

  return rewrites;
}
