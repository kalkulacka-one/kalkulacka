import type { Metadata } from "next";

import { GuidePageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string }> }): Promise<Metadata> {
  const { first, second, third } = await params;
  const canonicalUrl = canonical.guide({ first, second, third });
  return generateCalculatorMetadata({ key: second, group: third, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; embed: string }> }) {
  const { first, second, embed } = await params;

  return <GuidePageWithRouting segments={{ first, second, third, embed }} />;
}
