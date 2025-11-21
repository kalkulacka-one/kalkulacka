import type { Metadata } from "next";

import { IntroductionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ embed: string; first: string; second: string; third: string }> }): Promise<Metadata> {
  const segments = await params;
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const canonicalUrl = canonical.introduction(segments);
  return generateCalculatorMetadata({ key, group, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string; embed: string }> }) {
  const segments = await params;
  return <IntroductionPageWithRouting segments={segments} />;
}
