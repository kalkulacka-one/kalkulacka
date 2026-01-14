import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import type { Locale } from "next-intl";
import createNextIntlPlugin from "next-intl/plugin";
import rehypeSlug from "rehype-slug";

import { appConfig } from "./config/app-config";
import { getLocaleRedirects, getLocaleRewrites, getSlugRewrites } from "./config/i18n-routing";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  transpilePackages: ["@kalkulacka-one/design-system"],
  productionBrowserSourceMaps: true,
  async rewrites() {
    const { locales } = appConfig.i18n;
    return [
      ...locales.flatMap((locale) => getSlugRewrites(locale as Locale)),
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
        source: "/o-nas",
        destination: "/o-projekte",
        permanent: true,
      },
      {
        source: "/metodika-tvorby-otazok",
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
        source: "/volby/europske-2024/kalkulacka/:path*",
        destination: "https://archiv.volebnakalkulacka.sk/volby/europske-2024/kalkulacka/:path*",
        permanent: false,
      },
      {
        source: "/volby/europske-2024/expres/:path*",
        destination: "https://archiv.volebnakalkulacka.sk/volby/europske-2024/expres/:path*",
        permanent: false,
      },
      {
        source: "/volby/europske-2024/inventura/:path*",
        destination: "https://archiv.volebnakalkulacka.sk/volby/europske-2024/inventura/:path*",
        permanent: false,
      },
      {
        source: "/volby/prezidentske-2024/kalkulacka/:path*",
        destination: "https://archiv.volebnakalkulacka.sk/volby/prezidentske-2024/kalkulacka/:path*",
        permanent: false,
      },
      {
        source: "/volby/prezidentske-2024/kalkulacka-2-kolo/:path*",
        destination: "https://archiv.volebnakalkulacka.sk/volby/prezidentske-2024/kalkulacka-2-kolo/:path*",
        permanent: false,
      },
      {
        source: "/volby/prezidentske-2024/pre-mladych/:path*",
        destination: "https://archiv.volebnakalkulacka.sk/volby/prezidentske-2024/pre-mladych/:path*",
        permanent: false,
      },
      {
        source: "/volby/prezidentske-2024/pre-mladych-2-kolo/:path*",
        destination: "https://archiv.volebnakalkulacka.sk/volby/prezidentske-2024/pre-mladych-2-kolo/:path*",
        permanent: false,
      },
      {
        source: "/volby/nrsr-2023/kalkulacka/:path*",
        destination: "https://archiv.volebnakalkulacka.sk/volby/nrsr-2023/kalkulacka/:path*",
        permanent: false,
      },
      {
        source: "/volby/nrsr-2023/pre-mladych/:path*",
        destination: "https://archiv.volebnakalkulacka.sk/volby/nrsr-2023/pre-mladych/:path*",
        permanent: false,
      },
      {
        source: "/volby/nrsr-2023/inventura-2020-2023/:path*",
        destination: "https://archiv.volebnakalkulacka.sk/volby/nrsr-2023/inventura-2020-2023/:path*",
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
