import type { Metadata } from "next";

import { ResultPageWithRouting } from "../../../../../../../../components/client";
import { generateCalculatorMetadata } from "../../../../../../../../lib/metadata/calculator";
import { canonical } from "../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string }> }): Promise<Metadata> {
  const { first, second, third } = await params;
  const canonicalUrl = canonical.result({ first, second, third });
  return generateCalculatorMetadata({ key: second, group: third, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  return <ResultPageWithRouting segments={{ first, second, third }} />;
}
