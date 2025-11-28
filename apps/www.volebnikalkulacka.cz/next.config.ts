import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import rehypeSlug from "rehype-slug";

import { appConfig } from "./config/app-config";

const withNextIntl = createNextIntlPlugin();

/**
 * Localized URL slugs mapping.
 * Maps internal (English) route segment names to localized URL slugs.
 */
const SLUG_MAPPING = {
  introduction: { cs: "uvod", en: "introduction" },
  guide: { cs: "navod", en: "guide" },
  question: { cs: "otazka", en: "question" },
  review: { cs: "rekapitulace", en: "review" },
  result: { cs: "vysledek", en: "result" },
  comparison: { cs: "porovnani", en: "comparison" },
} as const;

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
 * Generate Czech slug rewrites for a single route pattern.
 * Maps Czech URLs to English filesystem routes.
 */
function generateCzechSlugRewrites(prefix: string, hasIdSlugs: readonly string[], defaultLocale: string) {
  const rewrites: Array<{ source: string; destination: string }> = [];

  for (const [slug, translations] of Object.entries(SLUG_MAPPING)) {
    const czechSlug = translations.cs;
    const englishSlug = slug;

    // Base rewrite: /prefix/czechSlug → /locale/prefix/englishSlug
    rewrites.push({
      source: `${prefix}/${czechSlug}`,
      destination: `/${defaultLocale}${prefix}/${englishSlug}`,
    });

    // Question has :num param
    if (slug === "question") {
      rewrites.push({
        source: `${prefix}/${czechSlug}/:num`,
        destination: `/${defaultLocale}${prefix}/${englishSlug}/:num`,
      });
    }

    // Result can have :id param for public results
    if (hasIdSlugs.includes(slug)) {
      rewrites.push({
        source: `${prefix}/${czechSlug}/:id`,
        destination: `/${defaultLocale}${prefix}/${englishSlug}/:id`,
      });
    }
  }

  return rewrites;
}

/**
 * Generate all Czech slug rewrites (Czech URLs → English routes).
 */
function getCzechSlugRewrites() {
  const { defaultLocale } = appConfig.i18n;
  const rewrites: Array<{ source: string; destination: string }> = [];

  for (const pattern of Object.values(ROUTE_PATTERNS)) {
    rewrites.push(...generateCzechSlugRewrites(pattern.prefix, pattern.hasId, defaultLocale));
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

  for (const [slug, translations] of Object.entries(SLUG_MAPPING)) {
    const englishSlug = translations.en;
    const czechSlug = translations.cs;

    // Skip if English and Czech slugs are the same (no need to block)
    if (englishSlug === czechSlug) continue;

    // Base rewrite: /prefix/englishSlug → /__404__
    rewrites.push({
      source: `${prefix}/${englishSlug}`,
      destination: "/__invalid_route_404__",
    });

    // Question has :num param
    if (slug === "question") {
      rewrites.push({
        source: `${prefix}/${englishSlug}/:num`,
        destination: "/__invalid_route_404__",
      });
    }

    // Result can have :id param
    if (hasIdSlugs.includes(slug)) {
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
    return [
      // English slug 404 rewrites (block English URLs) - must come first
      ...getEnglishSlug404Rewrites(),
      // Czech slug rewrites (Czech URLs → English routes)
      ...getCzechSlugRewrites(),
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
