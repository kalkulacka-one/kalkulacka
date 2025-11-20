import type { Metadata } from "next";

import { ReviewPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string }> }): Promise<Metadata> {
  const { first, second, third } = await params;
  const canonicalUrl = canonical.review({ first, second, third });
  return generateCalculatorMetadata({ key: third, group: second, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string; third: string }> }) {
  const { embed, first, second, third } = await params;

  return <ReviewPageWithRouting segments={{ first, second, third, embed }} />;
}
