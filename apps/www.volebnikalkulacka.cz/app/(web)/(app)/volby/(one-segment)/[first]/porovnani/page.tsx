import type { Metadata } from "next";

import { ComparisonPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata/calculator";
import { canonical } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const { first } = await params;
  const canonicalUrl = canonical.comparison({ first });
  return generateCalculatorMetadata({ key: first, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string }> }) {
  const { first } = await params;

  return <ComparisonPageWithRouting segments={{ first }} />;
}
