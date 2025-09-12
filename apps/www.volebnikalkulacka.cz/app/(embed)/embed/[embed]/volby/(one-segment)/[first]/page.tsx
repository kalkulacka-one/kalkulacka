import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { generateCanonicalMetadata } from "../../../../../../../lib/metadata/canonical";
import { routes } from "../../../../../../../lib/routing/route-builders";
import { canonical } from "../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const { first } = await params;
  return generateCanonicalMetadata(canonical.base({ first }));
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const { embed, first } = await params;
  redirect(routes.introduction({ first, embed }));
}
