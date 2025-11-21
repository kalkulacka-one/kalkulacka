import type { Metadata } from "next";

import { GuidePageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string }> }): Promise<Metadata> {
  const segments = await params;
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const canonicalUrl = canonical.guide(segments);
  return generateCalculatorMetadata({ key, group, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string; embed: string }> }) {
  const { first, second, third, embed } = await params;

  return <GuidePageWithRouting segments={{ first, second, third, embed }} />;
}
