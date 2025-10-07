import type { Metadata } from "next";

import { GuidePageWithRouting } from "../../../../../../../../../components/client";
import { generateCalculatorMetadata } from "../../../../../../../../../lib/metadata/calculator";
import { canonical } from "../../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await params;
  const canonicalUrl = canonical.guide({ first, second });
  return generateCalculatorMetadata({ key: first, group: second, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; embed: string }> }) {
  const { first, second, embed } = await params;

  return <GuidePageWithRouting segments={{ first, second, embed }} />;
}
