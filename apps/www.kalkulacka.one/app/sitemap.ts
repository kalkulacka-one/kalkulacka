import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.kalkulacka.one";
  const currentDate = new Date().toISOString();

  const locales = ["cs", "en"];
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/zapojte-se", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/vlastni-kalkulacka", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/podporte-kalkulacku", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add root page without locale prefix
  sitemapEntries.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 1.0,
  });

  // Add localized pages
  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: currentDate,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  return sitemapEntries;
}
