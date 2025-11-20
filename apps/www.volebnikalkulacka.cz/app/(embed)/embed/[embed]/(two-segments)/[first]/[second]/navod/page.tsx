import type { Metadata } from "next";

import { GuidePageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, isAllowedPrefix } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await params;
  const canonicalUrl = canonical.guide({ first, second });
  const metadataParams = isAllowedPrefix(first, second);
  return isAllowedPrefix(first)
    ? generateCalculatorMetadata({ key: second, canonicalUrl })
    : generateCalculatorMetadata({ key: second, group: first, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; embed: string }> }) {
  const { first, second, embed } = await params;

  return <GuidePageWithRouting segments={{ first, second, embed }} />;
}
