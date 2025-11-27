import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import rehypeSlug from "rehype-slug";

import { appConfig } from "./config/app-config";

const withNextIntl = createNextIntlPlugin();

function getLocaleRewrites() {
  const { defaultLocale, localePrefix } = appConfig.i18n;

  if (localePrefix === "as-needed" || localePrefix === undefined) {
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

  if (localePrefix === "as-needed" || localePrefix === undefined) {
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

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  transpilePackages: ["@kalkulacka-one/design-system"],
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [
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
