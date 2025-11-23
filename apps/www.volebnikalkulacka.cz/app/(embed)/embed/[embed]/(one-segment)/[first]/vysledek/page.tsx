import type { Metadata } from "next";

import { ResultPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ embed: string; first: string }> }): Promise<Metadata> {
  const segments = await params;
  const key = mappedParams.key(segments);
  const canonicalUrl = canonical.result(segments);
  return generateCalculatorMetadata({ key, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const segments = await params;
  return <ResultPageWithRouting segments={segments} />;
}
