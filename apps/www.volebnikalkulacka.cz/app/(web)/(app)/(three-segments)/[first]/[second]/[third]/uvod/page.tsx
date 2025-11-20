import type { Metadata } from "next";

import { IntroductionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string }> }): Promise<Metadata> {
  const { first, second, third } = await params;
  const canonicalUrl = canonical.introduction({ first, second, third });
  return generateCalculatorMetadata({ key: second, group: third, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  return <IntroductionPageWithRouting segments={{ first, second, third }} />;
}
