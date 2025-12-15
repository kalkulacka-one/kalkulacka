import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { appConfig } from "./config/app-config";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  transpilePackages: ["@kalkulacka-one/design-system"],
  async rewrites() {
    return [
      {
        source: "/",
        destination: `/${appConfig.i18n.defaultLocale}`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
