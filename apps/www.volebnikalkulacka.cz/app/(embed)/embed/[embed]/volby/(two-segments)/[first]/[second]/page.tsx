import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { generateCalculatorMetadata } from "../../../../../../../../lib/metadata/calculator";
import { routes } from "../../../../../../../../lib/routing/route-builders";
import { canonical } from "../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await params;
  const canonicalUrl = canonical.base({ first, second });
  return generateCalculatorMetadata({ key: first, group: second, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;
  redirect(routes.introduction({ first, second, embed }));
}
