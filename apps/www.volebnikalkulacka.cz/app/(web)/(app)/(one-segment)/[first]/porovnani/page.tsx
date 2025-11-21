import type { Metadata } from "next";

import { ComparisonPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const segments = await params;
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const canonicalUrl = canonical.comparison(segments);
  return generateCalculatorMetadata({ key, group, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string }> }) {
  const { first } = await params;

  return <ComparisonPageWithRouting segments={{ first }} />;
}
