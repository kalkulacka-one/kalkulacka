import type { Metadata } from "next";

import { IntroductionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string }> }): Promise<Metadata> {
  const { first, second, third } = await params;
  const canonicalUrl = canonical.introduction({ first, second, third });
  return generateCalculatorMetadata({ key: third, group: second, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string; embed: string }> }) {
  const { first, second, third, embed } = await params;

  return <IntroductionPageWithRouting segments={{ first, second, third, embed }} />;
}
