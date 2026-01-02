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
    return [...getLocaleRedirects()];
  },
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [rehypeSlug],
  },
});

export default withNextIntl(withMDX(nextConfig));
