import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { generateCanonicalMetadata } from "../../../../../../../../lib/metadata/canonical";
import { routes } from "../../../../../../../../lib/routing/route-builders";
import { canonical } from "../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await params;
  return generateCanonicalMetadata(canonical.base({ first, second }));
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;
  redirect(routes.introduction({ first, second, embed }));
}
