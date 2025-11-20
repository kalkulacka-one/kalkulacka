import type { Metadata } from "next";

import { GuidePageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, isAllowedPrefix } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await params;
  const canonicalUrl = canonical.guide({ first, second });

  if (isAllowedPrefix(first)) {
    return generateCalculatorMetadata({ key: second, canonicalUrl });
  }
  return generateCalculatorMetadata({ key: first, group: second, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  return <GuidePageWithRouting segments={{ first, second }} />;
}
