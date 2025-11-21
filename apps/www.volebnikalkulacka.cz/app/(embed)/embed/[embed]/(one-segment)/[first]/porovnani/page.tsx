import type { Metadata } from "next";

import { ComparisonPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const segments = await params;
  const key = mappedParams.key(segments);
  const canonicalUrl = canonical.comparison(segments);
  return generateCalculatorMetadata({ key, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const segments = await params;
  return <ComparisonPageWithRouting segments={segments} />;
}
