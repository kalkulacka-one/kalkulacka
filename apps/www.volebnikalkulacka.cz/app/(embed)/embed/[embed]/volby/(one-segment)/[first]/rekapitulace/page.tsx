import type { Metadata } from "next";

import { ReviewPageWithRouting } from "../../../../../../../../components/client";
import { generateCanonicalMetadata } from "../../../../../../../../lib/metadata/canonical";
import { canonical } from "../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const { first } = await params;
  return generateCanonicalMetadata(canonical.review({ first }));
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const { embed, first } = await params;

  return <ReviewPageWithRouting segments={{ first, embed }} />;
}
