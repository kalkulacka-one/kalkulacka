import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import type { Locale } from "next-intl";
import createNextIntlPlugin from "next-intl/plugin";

import { appConfig } from "./config/app-config";
import { getLocaleRedirects, getLocaleRewrites, getSlugRewrites } from "./config/i18n-routing";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  transpilePackages: ["@kalkulacka-one/design-system"],
  productionBrowserSourceMaps: true,
  async rewrites() {
    const { locales } = appConfig.i18n;
    return [
      {
        source: "/js/script.tagged-events.outbound-links.js",
        destination: "https://plausible.io/js/script.tagged-events.outbound-links.js",
      },
      {
        source: "/api/event",
        destination: "https://plausible.io/api/event",
      },
      ...locales.flatMap((locale) => getSlugRewrites(locale as Locale)),
      ...getLocaleRewrites(),
    ];
  },
  async redirects() {
    return [
      ...getLocaleRedirects(),
      {
        source: "/o-nas",
        destination: "/o-projektu",
        permanent: true,
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
        source: "/krajske-2024/:path*",
        destination: "https://archiv-2024.volebnikalkulacka.cz/volby/krajske-2024/:path*",
        permanent: false,
      },
      {
        source: "/volby/senatni-2024/:path*",
        destination: "https://archiv-2024.volebnikalkulacka.cz/volby/senatni-2024/:path*",
        permanent: false,
      },
      {
        source: "/senatni-2024/:path*",
        destination: "https://archiv-2024.volebnikalkulacka.cz/volby/senatni-2024/:path*",
        permanent: false,
      },
      {
        source: "/volby/evropske-2024/:path*",
        destination: "https://archiv-2024.volebnikalkulacka.cz/volby/evropske-2024/:path*",
        permanent: false,
      },
      {
        source: "/evropske-2024/:path*",
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
        source: "/prezidentske-2023/:path*",
        destination: "https://archiv.volebnikalkulacka.cz/volby/prezidentske-2023/:path*",
        permanent: false,
      },
      {
        source: "/volby/senatni-2022/:path*",
        destination: "https://archiv.volebnikalkulacka.cz/volby/senatni-2022/:path*",
        permanent: false,
      },
      {
        source: "/senatni-2022/:path*",
        destination: "https://archiv.volebnikalkulacka.cz/volby/senatni-2022/:path*",
        permanent: false,
      },
      {
        source: "/volby/komunalni-2022/:path*",
        destination: "https://archiv.volebnikalkulacka.cz/volby/komunalni-2022/:path*",
        permanent: false,
      },
      {
        source: "/komunalni-2022/:path*",
        destination: "https://archiv.volebnikalkulacka.cz/volby/komunalni-2022/:path*",
        permanent: false,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    rehypePlugins: ["rehype-slug"],
  },
});

export default withNextIntl(withMDX(nextConfig));
