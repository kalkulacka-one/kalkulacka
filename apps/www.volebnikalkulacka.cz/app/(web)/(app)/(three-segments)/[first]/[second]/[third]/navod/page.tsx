import type { Metadata } from "next";

import { GuidePageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, getThreeSegmentMetadataParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string }> }): Promise<Metadata> {
  const { first, second, third } = await params;
  const canonicalUrl = canonical.guide({ first, second, third });
  const metadataParams = getThreeSegmentMetadataParams(first, second, third);
  return generateCalculatorMetadata({ ...metadataParams, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  return <GuidePageWithRouting segments={{ first, second, third }} />;
}
