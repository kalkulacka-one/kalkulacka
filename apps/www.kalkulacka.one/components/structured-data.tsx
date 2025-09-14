"use client";

interface StructuredDataProps {
  locale: string;
}

export function StructuredData({ locale }: StructuredDataProps) {
  const baseUrl = "https://www.kalkulacka.one";

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kalkulacka.1",
    alternateName: "Multi-country Voting Advice Platform",
    url: baseUrl,
    description: "Open-source platform for creating voting advice applications across multiple countries.",
    inLanguage: [locale, "cs", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Kalkulacka.1",
      url: baseUrl,
      logo: `${baseUrl}/og-kalkulacka-one.png`,
    },
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kalkulacka.1",
    url: baseUrl,
    logo: `${baseUrl}/og-kalkulacka-one.png`,
    description: "Open-source platform for creating voting advice applications and supporting democratic participation.",
    foundingDate: "2017",
    knowsAbout: ["Voting advice applications", "Democracy", "Elections", "Political participation", "Open source software", "Civic technology"],
    sameAs: ["https://x.com/kalkulacka_one", "https://github.com/kalkulacka-one"],
    areaServed: [
      {
        "@type": "Country",
        name: "Czech Republic",
      },
      {
        "@type": "Country",
        name: "Slovakia",
      },
      {
        "@type": "Country",
        name: "Albania",
      },
    ],
  };

  const softwareApplicationStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kalkulacka.1 Platform",
    url: baseUrl,
    description: "Open-source platform for creating and deploying voting advice applications",
    applicationCategory: "Political Tool",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: ["Multi-country support", "Customizable questionnaires", "Political party matching algorithms", "Results visualization", "Multilingual interface", "Open source codebase"],
  };

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationStructuredData),
        }}
      />
    </>
  );
}
