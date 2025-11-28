import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import rehypeSlug from "rehype-slug";

import { appConfig } from "./config/app-config";

const withNextIntl = createNextIntlPlugin();

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

function getCzechSlugRewrites() {
  const { defaultLocale } = appConfig.i18n;

  // Czech route slug rewrites (Czech URLs → English routes)
  // These must come BEFORE the fallback locale rewrites to take precedence
  return [
    // Embed routes (one segment)
    { source: "/embed/:embed/:p1/uvod", destination: `/${defaultLocale}/embed/:embed/:p1/introduction` },
    { source: "/embed/:embed/:p1/navod", destination: `/${defaultLocale}/embed/:embed/:p1/guide` },
    { source: "/embed/:embed/:p1/otazka", destination: `/${defaultLocale}/embed/:embed/:p1/question` },
    { source: "/embed/:embed/:p1/otazka/:num", destination: `/${defaultLocale}/embed/:embed/:p1/question/:num` },
    { source: "/embed/:embed/:p1/rekapitulace", destination: `/${defaultLocale}/embed/:embed/:p1/review` },
    { source: "/embed/:embed/:p1/vysledek", destination: `/${defaultLocale}/embed/:embed/:p1/result` },
    { source: "/embed/:embed/:p1/porovnani", destination: `/${defaultLocale}/embed/:embed/:p1/comparison` },
    // Embed routes (two segments)
    { source: "/embed/:embed/:p1/:p2/uvod", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/introduction` },
    { source: "/embed/:embed/:p1/:p2/navod", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/guide` },
    { source: "/embed/:embed/:p1/:p2/otazka", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/question` },
    { source: "/embed/:embed/:p1/:p2/otazka/:num", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/question/:num` },
    { source: "/embed/:embed/:p1/:p2/rekapitulace", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/review` },
    { source: "/embed/:embed/:p1/:p2/vysledek", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/result` },
    { source: "/embed/:embed/:p1/:p2/porovnani", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/comparison` },
    // Embed routes (three segments)
    { source: "/embed/:embed/:p1/:p2/:p3/uvod", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/:p3/introduction` },
    { source: "/embed/:embed/:p1/:p2/:p3/navod", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/:p3/guide` },
    { source: "/embed/:embed/:p1/:p2/:p3/otazka", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/:p3/question` },
    { source: "/embed/:embed/:p1/:p2/:p3/otazka/:num", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/:p3/question/:num` },
    { source: "/embed/:embed/:p1/:p2/:p3/rekapitulace", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/:p3/review` },
    { source: "/embed/:embed/:p1/:p2/:p3/vysledek", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/:p3/result` },
    { source: "/embed/:embed/:p1/:p2/:p3/porovnani", destination: `/${defaultLocale}/embed/:embed/:p1/:p2/:p3/comparison` },
    // Web routes (one segment)
    { source: "/volby/:p1/uvod", destination: `/${defaultLocale}/volby/:p1/introduction` },
    { source: "/volby/:p1/navod", destination: `/${defaultLocale}/volby/:p1/guide` },
    { source: "/volby/:p1/otazka", destination: `/${defaultLocale}/volby/:p1/question` },
    { source: "/volby/:p1/otazka/:num", destination: `/${defaultLocale}/volby/:p1/question/:num` },
    { source: "/volby/:p1/rekapitulace", destination: `/${defaultLocale}/volby/:p1/review` },
    { source: "/volby/:p1/vysledek", destination: `/${defaultLocale}/volby/:p1/result` },
    { source: "/volby/:p1/vysledek/:id", destination: `/${defaultLocale}/volby/:p1/result/:id` },
    { source: "/volby/:p1/porovnani", destination: `/${defaultLocale}/volby/:p1/comparison` },
    // Web routes (two segments)
    { source: "/volby/:p1/:p2/uvod", destination: `/${defaultLocale}/volby/:p1/:p2/introduction` },
    { source: "/volby/:p1/:p2/navod", destination: `/${defaultLocale}/volby/:p1/:p2/guide` },
    { source: "/volby/:p1/:p2/otazka", destination: `/${defaultLocale}/volby/:p1/:p2/question` },
    { source: "/volby/:p1/:p2/otazka/:num", destination: `/${defaultLocale}/volby/:p1/:p2/question/:num` },
    { source: "/volby/:p1/:p2/rekapitulace", destination: `/${defaultLocale}/volby/:p1/:p2/review` },
    { source: "/volby/:p1/:p2/vysledek", destination: `/${defaultLocale}/volby/:p1/:p2/result` },
    { source: "/volby/:p1/:p2/vysledek/:id", destination: `/${defaultLocale}/volby/:p1/:p2/result/:id` },
    { source: "/volby/:p1/:p2/porovnani", destination: `/${defaultLocale}/volby/:p1/:p2/comparison` },
    // Web routes (three segments)
    { source: "/volby/:p1/:p2/:p3/uvod", destination: `/${defaultLocale}/volby/:p1/:p2/:p3/introduction` },
    { source: "/volby/:p1/:p2/:p3/navod", destination: `/${defaultLocale}/volby/:p1/:p2/:p3/guide` },
    { source: "/volby/:p1/:p2/:p3/otazka", destination: `/${defaultLocale}/volby/:p1/:p2/:p3/question` },
    { source: "/volby/:p1/:p2/:p3/otazka/:num", destination: `/${defaultLocale}/volby/:p1/:p2/:p3/question/:num` },
    { source: "/volby/:p1/:p2/:p3/rekapitulace", destination: `/${defaultLocale}/volby/:p1/:p2/:p3/review` },
    { source: "/volby/:p1/:p2/:p3/vysledek", destination: `/${defaultLocale}/volby/:p1/:p2/:p3/result` },
    { source: "/volby/:p1/:p2/:p3/vysledek/:id", destination: `/${defaultLocale}/volby/:p1/:p2/:p3/result/:id` },
    { source: "/volby/:p1/:p2/:p3/porovnani", destination: `/${defaultLocale}/volby/:p1/:p2/:p3/comparison` },
  ];
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
 * Redirects from English slugs to Czech slugs.
 * This ensures that if someone visits /volby/.../introduction,
 * they get redirected to /volby/.../uvod (the canonical Czech URL).
 */
function getEnglishToCzechRedirects() {
  return [
    // Web routes (one segment)
    { source: "/volby/:p1/introduction", destination: "/volby/:p1/uvod", permanent: true },
    { source: "/volby/:p1/guide", destination: "/volby/:p1/navod", permanent: true },
    { source: "/volby/:p1/question", destination: "/volby/:p1/otazka", permanent: true },
    { source: "/volby/:p1/question/:num", destination: "/volby/:p1/otazka/:num", permanent: true },
    { source: "/volby/:p1/review", destination: "/volby/:p1/rekapitulace", permanent: true },
    { source: "/volby/:p1/result", destination: "/volby/:p1/vysledek", permanent: true },
    { source: "/volby/:p1/result/:id", destination: "/volby/:p1/vysledek/:id", permanent: true },
    { source: "/volby/:p1/comparison", destination: "/volby/:p1/porovnani", permanent: true },
    // Web routes (two segments)
    { source: "/volby/:p1/:p2/introduction", destination: "/volby/:p1/:p2/uvod", permanent: true },
    { source: "/volby/:p1/:p2/guide", destination: "/volby/:p1/:p2/navod", permanent: true },
    { source: "/volby/:p1/:p2/question", destination: "/volby/:p1/:p2/otazka", permanent: true },
    { source: "/volby/:p1/:p2/question/:num", destination: "/volby/:p1/:p2/otazka/:num", permanent: true },
    { source: "/volby/:p1/:p2/review", destination: "/volby/:p1/:p2/rekapitulace", permanent: true },
    { source: "/volby/:p1/:p2/result", destination: "/volby/:p1/:p2/vysledek", permanent: true },
    { source: "/volby/:p1/:p2/result/:id", destination: "/volby/:p1/:p2/vysledek/:id", permanent: true },
    { source: "/volby/:p1/:p2/comparison", destination: "/volby/:p1/:p2/porovnani", permanent: true },
    // Web routes (three segments)
    { source: "/volby/:p1/:p2/:p3/introduction", destination: "/volby/:p1/:p2/:p3/uvod", permanent: true },
    { source: "/volby/:p1/:p2/:p3/guide", destination: "/volby/:p1/:p2/:p3/navod", permanent: true },
    { source: "/volby/:p1/:p2/:p3/question", destination: "/volby/:p1/:p2/:p3/otazka", permanent: true },
    { source: "/volby/:p1/:p2/:p3/question/:num", destination: "/volby/:p1/:p2/:p3/otazka/:num", permanent: true },
    { source: "/volby/:p1/:p2/:p3/review", destination: "/volby/:p1/:p2/:p3/rekapitulace", permanent: true },
    { source: "/volby/:p1/:p2/:p3/result", destination: "/volby/:p1/:p2/:p3/vysledek", permanent: true },
    { source: "/volby/:p1/:p2/:p3/result/:id", destination: "/volby/:p1/:p2/:p3/vysledek/:id", permanent: true },
    { source: "/volby/:p1/:p2/:p3/comparison", destination: "/volby/:p1/:p2/:p3/porovnani", permanent: true },
    // Embed routes (one segment)
    { source: "/embed/:embed/:p1/introduction", destination: "/embed/:embed/:p1/uvod", permanent: true },
    { source: "/embed/:embed/:p1/guide", destination: "/embed/:embed/:p1/navod", permanent: true },
    { source: "/embed/:embed/:p1/question", destination: "/embed/:embed/:p1/otazka", permanent: true },
    { source: "/embed/:embed/:p1/question/:num", destination: "/embed/:embed/:p1/otazka/:num", permanent: true },
    { source: "/embed/:embed/:p1/review", destination: "/embed/:embed/:p1/rekapitulace", permanent: true },
    { source: "/embed/:embed/:p1/result", destination: "/embed/:embed/:p1/vysledek", permanent: true },
    { source: "/embed/:embed/:p1/comparison", destination: "/embed/:embed/:p1/porovnani", permanent: true },
    // Embed routes (two segments)
    { source: "/embed/:embed/:p1/:p2/introduction", destination: "/embed/:embed/:p1/:p2/uvod", permanent: true },
    { source: "/embed/:embed/:p1/:p2/guide", destination: "/embed/:embed/:p1/:p2/navod", permanent: true },
    { source: "/embed/:embed/:p1/:p2/question", destination: "/embed/:embed/:p1/:p2/otazka", permanent: true },
    { source: "/embed/:embed/:p1/:p2/question/:num", destination: "/embed/:embed/:p1/:p2/otazka/:num", permanent: true },
    { source: "/embed/:embed/:p1/:p2/review", destination: "/embed/:embed/:p1/:p2/rekapitulace", permanent: true },
    { source: "/embed/:embed/:p1/:p2/result", destination: "/embed/:embed/:p1/:p2/vysledek", permanent: true },
    { source: "/embed/:embed/:p1/:p2/comparison", destination: "/embed/:embed/:p1/:p2/porovnani", permanent: true },
    // Embed routes (three segments)
    { source: "/embed/:embed/:p1/:p2/:p3/introduction", destination: "/embed/:embed/:p1/:p2/:p3/uvod", permanent: true },
    { source: "/embed/:embed/:p1/:p2/:p3/guide", destination: "/embed/:embed/:p1/:p2/:p3/navod", permanent: true },
    { source: "/embed/:embed/:p1/:p2/:p3/question", destination: "/embed/:embed/:p1/:p2/:p3/otazka", permanent: true },
    { source: "/embed/:embed/:p1/:p2/:p3/question/:num", destination: "/embed/:embed/:p1/:p2/:p3/otazka/:num", permanent: true },
    { source: "/embed/:embed/:p1/:p2/:p3/review", destination: "/embed/:embed/:p1/:p2/:p3/rekapitulace", permanent: true },
    { source: "/embed/:embed/:p1/:p2/:p3/result", destination: "/embed/:embed/:p1/:p2/:p3/vysledek", permanent: true },
    { source: "/embed/:embed/:p1/:p2/:p3/comparison", destination: "/embed/:embed/:p1/:p2/:p3/porovnani", permanent: true },
  ];
}

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  transpilePackages: ["@kalkulacka-one/design-system"],
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [
      // Czech slug rewrites must come first (before fallback locale rewrites)
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
      // English → Czech slug redirects (must come first)
      ...getEnglishToCzechRedirects(),
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
