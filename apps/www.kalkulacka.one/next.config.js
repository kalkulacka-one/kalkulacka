const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Render metadata in <head> for every user agent: streamed metadata lands in <body>, where Google ignores rel=canonical
  htmlLimitedBots: /.*/,
  transpilePackages: ["@kalkulacka-one/design-system"],
  async rewrites() {
    return [
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
};

module.exports = withNextIntl(nextConfig);
