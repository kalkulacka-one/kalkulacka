import type { Metadata } from "next";

import { ResultPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; embed: string; first: string; second: string }> }): Promise<Metadata> {
  const { locale, ...segments } = await params;
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const canonicalUrl = canonical.result(segments, locale);
  return generateCalculatorMetadata({ key, group, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const segments = await params;
  return <ResultPageWithRouting segments={segments} />;
}
