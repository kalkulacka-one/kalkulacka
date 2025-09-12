import type { Metadata } from "next";

import { IntroductionPageWithRouting } from "../../../../../../../../components/client";
import { generateCanonicalMetadata } from "../../../../../../../../lib/metadata/canonical";
import { canonical } from "../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const { first } = await params;
  return generateCanonicalMetadata(canonical.introduction({ first }));
}

export default async function Page({ params }: { params: Promise<{ first: string; embed: string }> }) {
  const { first, embed } = await params;

  return <IntroductionPageWithRouting segments={{ first, embed }} />;
}
