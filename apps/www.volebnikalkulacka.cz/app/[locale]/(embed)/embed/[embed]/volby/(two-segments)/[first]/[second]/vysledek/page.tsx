import type { Metadata } from "next";

import { ResultPageWithRouting } from "../../../../../../../../../../components/client";
import { generateCalculatorMetadata } from "../../../../../../../../../../lib/metadata/calculator";
import { canonical } from "../../../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await params;
  const canonicalUrl = canonical.result({ first, second });
  return generateCalculatorMetadata({ key: first, group: second, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;

  return <ResultPageWithRouting segments={{ first, second, embed }} />;
}
