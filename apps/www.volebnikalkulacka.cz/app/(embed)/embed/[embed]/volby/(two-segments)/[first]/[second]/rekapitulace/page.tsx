import type { Metadata } from "next";

import { ReviewPageWithRouting } from "../../../../../../../../../components/client";
import { generateCanonicalMetadata } from "../../../../../../../../../lib/metadata/canonical";
import { canonical } from "../../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await params;
  return generateCanonicalMetadata(canonical.review({ first, second }));
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;

  return <ReviewPageWithRouting segments={{ first, second, embed }} />;
}
