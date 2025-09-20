const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
module.exports = withMDX({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  transpilePackages: ["@repo/design-system"],
  productionBrowserSourceMaps: true,
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
  async redirects() {
    return [
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
});
