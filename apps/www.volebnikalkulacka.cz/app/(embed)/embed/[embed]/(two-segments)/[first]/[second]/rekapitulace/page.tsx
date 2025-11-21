import type { Metadata } from "next";

import { ReviewPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ embed: string; first: string; second: string }> }): Promise<Metadata> {
  const segments = await routeParams;
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const canonicalUrl = canonical.review(segments);
  return generateCalculatorMetadata({ key, group, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const segments = await params;
  return <ReviewPageWithRouting segments={segments} />;
}
