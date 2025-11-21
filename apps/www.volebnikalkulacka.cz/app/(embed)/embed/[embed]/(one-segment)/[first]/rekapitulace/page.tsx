import type { Metadata } from "next";

import { ReviewPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, mappedParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const segments = await params;
  const key = mappedParams.key(segments);
  const canonicalUrl = canonical.review(segments);
  return generateCalculatorMetadata({ key, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const { embed, first } = await params;

  return <ReviewPageWithRouting segments={{ first, embed }} />;
}
