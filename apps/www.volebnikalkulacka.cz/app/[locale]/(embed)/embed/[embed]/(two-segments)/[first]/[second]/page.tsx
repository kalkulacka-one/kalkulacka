import { calculatorGuard, GroupRootPage, groupRootMetadata, isPrefix } from "@kalkulacka-one/next";

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { Locale } from "next-intl";

import { appConfig } from "@/config/app-config";
import { type EmbedName, embedsConfig } from "@/config/embeds";
import { canonical, mappedParams, PREFIXES, routes } from "@/lib/routing";

type Params = Promise<{ locale: Locale; embed: EmbedName; first: string; second: string }>;

function endpoint(): string {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }
  return process.env.DATA_ENDPOINT;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: _locale, ...segments } = await params;
  if (!isPrefix({ segment: segments.first, validPrefixes: PREFIXES })) return {};
  return groupRootMetadata({ endpoint: endpoint(), segments, canonical });
}

export default async function Page({ params }: { params: Params }) {
  const { locale, ...segments } = await params;

  if (!isPrefix({ segment: segments.first, validPrefixes: PREFIXES })) {
    await calculatorGuard({ endpoint: endpoint(), key: mappedParams.key(segments), group: mappedParams.group(segments), prefixed: false });
    redirect(routes.introduction(segments, locale));
  }

  return (
    <GroupRootPage
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
