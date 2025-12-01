import type { Metadata } from "next";

import { GuidePageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; first: string }> }): Promise<Metadata> {
  const { locale, ...segments } = await params;
  const key = mappedParams.key(segments);
  const canonicalUrl = canonical.guide(segments, locale);
  return generateCalculatorMetadata({ key, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string }> }) {
  const segments = await params;
  return <GuidePageWithRouting segments={segments} />;
}
