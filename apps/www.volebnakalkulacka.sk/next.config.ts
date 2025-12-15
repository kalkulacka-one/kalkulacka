import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { appConfig } from "./config/app-config";

const withNextIntl = createNextIntlPlugin();

const { defaultLocale, locales } = appConfig.i18n;
const localesPattern = locales.join("|");

const nextConfig: NextConfig = {
  transpilePackages: ["@kalkulacka-one/design-system"],
  async rewrites() {
    return [
      {
        source: "/",
        destination: `/${defaultLocale}`,
      },
      {
        source: `/:path((?!(?:${localesPattern}|api|_next|favicon\\.ico)(?:/|$)).*)*`,
        destination: `/${defaultLocale}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: `/${defaultLocale}/:path((?!embed).*)*`,
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
