import type { Metadata } from "next";

import { ResultPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, params } from "@/lib/routing";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await routeParams;
  const canonicalUrl = canonical.result({ first, second });
  const metadataParams = params.twoSegment(first, second);
  return generateCalculatorMetadata({ ...metadataParams, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;

  return <ResultPageWithRouting segments={{ first, second, embed }} />;
}
