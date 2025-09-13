"use client";

export function StructuredData() {
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Volební kalkulačka",
    alternateName: "Volební kalkulačka 2025",
    url: "https://www.volebnikalkulacka.cz",
    description: "Nejužitečnějších 5 minut před sněmovními volbami 2025. Zjistěte, která strana či koalice se nejvíc shoduje s vašimi názory.",
    inLanguage: "cs",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.volebnikalkulacka.cz/kalkulacky?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Volební kalkulačka",
      url: "https://www.volebnikalkulacka.cz",
      logo: "https://www.volebnikalkulacka.cz/icon-512.png",
    },
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Volební kalkulačka",
    url: "https://www.volebnikalkulacka.cz",
    logo: "https://www.volebnikalkulacka.cz/icon-512.png",
    description: "Nezávislá volební kalkulačka pro sněmovní volby 2025 v České republice.",
    foundingDate: "2017",
    areaServed: {
      "@type": "Country",
      name: "Czech Republic",
    },
    knowsAbout: ["Political parties", "Elections", "Democracy", "Voting advice", "Political compass", "Czech politics"],
    sameAs: ["https://x.com/volebnikalkulacka", "https://www.facebook.com/volebnikalkulacka"],
  };

  const webApplicationStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Volební kalkulačka",
    url: "https://www.volebnikalkulacka.cz",
    description: "Interaktivní volební kalkulačka pro sněmovní volby 2025",
    applicationCategory: "Political Tool",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CZK",
      availability: "https://schema.org/InStock",
    },
    featureList: ["Interactive voting questionnaire", "Political party matching", "Results visualization", "Candidate information", "Electoral district data"],
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
          __html: JSON.stringify(webApplicationStructuredData),
        }}
      />
    </>
  );
}
