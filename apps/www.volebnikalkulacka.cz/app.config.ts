export const appConfig = {
  metadata: {
    siteName: "Volební kalkulačka",
    description: "Nejužitečnějších 5 minut před sněmovními volbami 2025",
    locale: "cs_CZ",
    language: "cs",
    url: "https://www.volebnikalkulacka.cz",
    ogImage: {
      alt: "Volební kalkulačka - Sněmovní volby 2025",
    },
  },
  socialLinks: {
    instagram: "https://www.instagram.com/volebnikalk",
    twitter: "https://twitter.com/volebnikalk",
    status: "https://status.volebnikalkulacka.cz",
    analytics: "https://plausible.io/volebnikalkulacka.cz",
  },
  footer: {
    links: [
      { label: "Status", href: "https://status.volebnikalkulacka.cz", external: true },
      { label: "Statistiky", href: "https://plausible.io/volebnikalkulacka.cz", external: true },
      { label: "Soukromí", href: "/soukromi", external: false },
    ],
    copyright: "© 2025 Volební kalkulačka",
  },
};
