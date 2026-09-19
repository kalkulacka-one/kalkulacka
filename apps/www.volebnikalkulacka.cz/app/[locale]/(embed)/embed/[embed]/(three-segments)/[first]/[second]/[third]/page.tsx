import { CalculatorRootPage, calculatorRootMetadata } from "@kalkulacka-one/next";

import type { Metadata } from "next";
import type { Locale } from "next-intl";

import { appConfig } from "@/config/app-config";
import { type EmbedName, embedsConfig } from "@/config/embeds";
import { canonical, routes } from "@/lib/routing";

type Params = Promise<{ locale: Locale; embed: EmbedName; first: string; second: string; third: string }>;

function endpoint(): string {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }
  return process.env.DATA_ENDPOINT;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: _locale, ...segments } = await params;
  return calculatorRootMetadata({ endpoint: endpoint(), segments, canonical });
}

export default async function Page({ params }: { params: Params }) {
  const { locale, ...segments } = await params;
  return (
    <CalculatorRootPage
      endpoint={endpoint()}
      segments={segments}
      locale={locale}
      embedContext={{ isEmbed: true, name: segments.embed, config: embedsConfig[segments.embed] }}
      routes={routes}
      canonical={canonical}
      homepageHref={canonical.homepage()}
      privacyHref={appConfig.links?.privacy}
    />
  );
}
