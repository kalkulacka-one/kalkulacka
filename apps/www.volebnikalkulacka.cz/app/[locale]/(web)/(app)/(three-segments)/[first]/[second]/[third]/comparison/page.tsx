import type { Metadata } from "next";

import { ComparisonPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; first: string; second: string; third: string }> }): Promise<Metadata> {
  const { locale, ...segments } = await params;
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const canonicalUrl = canonical.comparison(segments, locale);
  return generateCalculatorMetadata({ key, group, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string }> }) {
  const segments = await params;
  return <ComparisonPageWithRouting segments={segments} />;
}
