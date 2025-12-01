import type { Metadata } from "next";

import { IntroductionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; embed: string; first: string }> }): Promise<Metadata> {
  const { locale, ...segments } = await params;
  const key = mappedParams.key(segments);
  const canonicalUrl = canonical.introduction(segments, locale);
  return generateCalculatorMetadata({ key, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const segments = await params;
  return <IntroductionPageWithRouting segments={segments} />;
}
