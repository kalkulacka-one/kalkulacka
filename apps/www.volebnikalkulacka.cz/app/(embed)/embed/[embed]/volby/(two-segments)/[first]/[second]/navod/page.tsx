import type { Metadata } from "next";

import { GuidePageWithRouting } from "../../../../../../../../../components/client";
import { generateCanonicalMetadata } from "../../../../../../../../../lib/metadata/canonical";
import { canonical } from "../../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await params;
  return generateCanonicalMetadata(canonical.guide({ first, second }));
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; embed: string }> }) {
  const { first, second, embed } = await params;

  return <GuidePageWithRouting segments={{ first, second, embed }} />;
}
