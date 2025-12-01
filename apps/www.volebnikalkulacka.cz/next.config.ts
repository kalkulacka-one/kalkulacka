import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import rehypeSlug from "rehype-slug";

import { BLOCKED_ENGLISH_SLUGS, LOCALIZED_SLUGS, type PageType } from "@/config/localized-slugs";

import { appConfig } from "./config/app-config";

const withNextIntl = createNextIntlPlugin();

/**
 * Route patterns with their slug configurations.
 * Each pattern defines the URL structure and which slugs have additional params.
 */
const ROUTE_PATTERNS = {
  // Web routes
  web1: { prefix: "/volby/:p1", hasId: ["result"] },
  web2: { prefix: "/volby/:p1/:p2", hasId: ["result"] },
  web3: { prefix: "/volby/:p1/:p2/:p3", hasId: ["result"] },
  // Embed routes
  embed1: { prefix: "/embed/:embed/:p1", hasId: [] as string[] },
  embed2: { prefix: "/embed/:embed/:p1/:p2", hasId: [] as string[] },
  embed3: { prefix: "/embed/:embed/:p1/:p2/:p3", hasId: [] as string[] },
} as const;

/**
 * Generate localized slug rewrites for a single route pattern.
 * Maps localized URLs to English filesystem routes.
 */
function generateSlugRewrites(fromLocale: string, toLocale: string, prefix: string, hasIdSlugs: readonly string[]) {
  const rewrites: Array<{ source: string; destination: string }> = [];

  const fromSlugs = LOCALIZED_SLUGS[fromLocale];
  if (!fromSlugs) {
    throw new Error(`Locale '${fromLocale}' not found in LOCALIZED_SLUGS`);
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
function getSlugRewrites(fromLocale: string) {
  const { defaultLocale } = appConfig.i18n;
  const rewrites: Array<{ source: string; destination: string }> = [];

  for (const pattern of Object.values(ROUTE_PATTERNS)) {
    rewrites.push(...generateSlugRewrites(fromLocale, defaultLocale, pattern.prefix, pattern.hasId));
  }

  return rewrites;
}

function getLocaleRewrites() {
  const { defaultLocale, localePrefix } = appConfig.i18n;

  if (localePrefix === "as-needed") {
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
        source: "/volby/:path*",
        destination: `/${defaultLocale}/volby/:path*`,
      },
    ];
  }

  return [];
}

function getLocaleRedirects() {
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

  const czechSlugs = LOCALIZED_SLUGS[defaultLocale];
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
function getEnglishSlug404Rewrites() {
  const rewrites: Array<{ source: string; destination: string }> = [];

  for (const pattern of Object.values(ROUTE_PATTERNS)) {
    rewrites.push(...generateEnglishSlug404Rewrites(pattern.prefix, pattern.hasId));
  }

  return rewrites;
}

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  transpilePackages: ["@kalkulacka-one/design-system"],
  productionBrowserSourceMaps: true,
  async rewrites() {
    const { defaultLocale } = appConfig.i18n;
    return [
      // English slug 404 rewrites (block English URLs) - must come first
      ...getEnglishSlug404Rewrites(),
      // Czech slug rewrites (Czech URLs → English routes)
      ...getSlugRewrites(defaultLocale),
      // Fallback locale rewrites
      ...getLocaleRewrites(),
      {
        source: "/js/script.tagged-events.outbound-links.js",
        destination: "https://plausible.io/js/script.tagged-events.outbound-links.js",
      },
      {
        source: "/api/event",
        destination: "https://plausible.io/api/event",
      },
    ];
  },
  async redirects() {
    return [
      ...getLocaleRedirects(),
      {
        source: "/volby/snemovni-2025",
        destination: "/volby/snemovni-2025/kalkulacka",
        permanent: false,
      },
      {
        source: "/metodika-tvorby-otazek",
        destination: "/metodika",
        permanent: true,
      },
      {
        source: "/ochrana-dat",
        destination: "/soukromi",
        permanent: true,
      },
      // 2024 archive redirects
      {
        source: "/o-volbach",
        destination: "https://archiv-2024.volebnikalkulacka.cz/o-volbach",
        permanent: false,
      },
      {
        source: "/archiv",
        destination: "https://archiv-2024.volebnikalkulacka.cz/archiv",
        permanent: false,
      },
      {
        source: "/volby/krajske-2024/:path*",
        destination: "https://archiv-2024.volebnikalkulacka.cz/volby/krajske-2024/:path*",
        permanent: false,
      },
      {
        source: "/volby/senatni-2024/:path*",
        destination: "https://archiv-2024.volebnikalkulacka.cz/volby/senatni-2024/:path*",
        permanent: false,
      },
      {
        source: "/volby/evropske-2024/:path*",
        destination: "https://archiv-2024.volebnikalkulacka.cz/volby/evropske-2024/:path*",
        permanent: false,
      },
      // 2022 archive redirects
      {
        source: "/volby/prezidentske-2023/:path*",
        destination: "https://archiv.volebnikalkulacka.cz/volby/prezidentske-2023/:path*",
        permanent: false,
      },
      {
        source: "/volby/senatni-2022/:path*",
        destination: "https://archiv.volebnikalkulacka.cz/volby/senatni-2022/:path*",
        permanent: false,
      },
      {
        source: "/volby/komunalni-2022/:path*",
        destination: "https://archiv.volebnikalkulacka.cz/volby/komunalni-2022/:path*",
        permanent: false,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [rehypeSlug],
  },
});

export default withNextIntl(withMDX(nextConfig));
