export const appConfig = {
  metadata: {
    siteName: "Volebná kalkulačka",
    description: "Najužitočnejších 5 minút pred parlamentnými voľbami 2025",
    locale: "sk_SK",
    language: "sk",
    url: "https://www.volebnakalkulacka.sk",
    ogImage: {
      alt: "Volebná kalkulačka - Parlamentné voľby 2025",
    },
  },
  socialLinks: {
    instagram: "https://www.instagram.com/volebnakalk",
    twitter: "https://twitter.com/volebnakalk",
    status: "https://status.volebnakalkulacka.sk",
    analytics: "https://plausible.io/volebnakalkulacka.sk",
  },
  footer: {
    links: [
      { label: "Status", href: "https://status.volebnakalkulacka.sk", external: true },
      { label: "Štatistiky", href: "https://plausible.io/volebnakalkulacka.sk", external: true },
      { label: "Súkromie", href: "/sukromie", external: false },
    ],
    copyright: "© 2025 Volebná kalkulačka",
  },
};
