import type { Metadata } from "next";

import { IntroductionPageWithRouting } from "../../../../../../../components/client";
import { generateCalculatorMetadata } from "../../../../../../../lib/metadata/calculator";
import { canonical } from "../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const { first } = await params;
  const canonicalUrl = canonical.introduction({ first });
  return generateCalculatorMetadata({ key: first, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ first: string }> }) {
  const { first } = await params;

  return <IntroductionPageWithRouting segments={{ first }} />;
}
