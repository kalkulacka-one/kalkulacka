import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypeSlug from "rehype-slug";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  transpilePackages: ["@kalkulacka-one/design-system"],
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
        source: "/a-voksmonitor-modszertana",
        destination: "https://old.voksmonitor.hu/a-voksmonitor-modszertana",
        permanent: false,
      },
      {
        source: "/a-voksmonitorrol",
        destination: "https://old.voksmonitor.hu/a-voksmonitorrol",
        permanent: false,
      },
      {
        source: "/adatvedelem",
        destination: "https://old.voksmonitor.hu/adatvedelem",
        permanent: false,
      },
      {
        source: "/valasztasok/europai-2024/:path*",
        destination: "https://old.voksmonitor.hu/valasztasok/europai-2024/:path*",
        permanent: false,
      },
      {
        source: "/valasztasok/onkormanyzati-2024/:path*",
        destination: "https://old.voksmonitor.hu/valasztasok/onkormanyzati-2024/:path*",
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

export default withMDX(nextConfig);
