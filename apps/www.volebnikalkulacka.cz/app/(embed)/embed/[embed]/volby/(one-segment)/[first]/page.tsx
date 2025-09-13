import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { generateCalculatorMetadata } from "../../../../../../../lib/metadata/calculator";
import { routes } from "../../../../../../../lib/routing/route-builders";
import { canonical } from "../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const { first } = await params;
  const canonicalUrl = canonical.base({ first });
  return generateCalculatorMetadata({ key: first, canonicalUrl });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const { embed, first } = await params;
  redirect(routes.introduction({ first, embed }));
}
