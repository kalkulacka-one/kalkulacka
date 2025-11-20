import type { Metadata } from "next";

import { ComparisonPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, params } from "@/lib/routing";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await routeParams;
  const canonicalUrl = canonical.comparison({ first, second });

  const metadataParams = params.twoSegment(first, second);
  return generateCalculatorMetadata({ ...metadataParams, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  return <ComparisonPageWithRouting segments={{ first, second }} />;
}
