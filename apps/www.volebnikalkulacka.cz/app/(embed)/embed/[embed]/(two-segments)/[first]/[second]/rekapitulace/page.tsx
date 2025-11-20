import type { Metadata } from "next";

import { ReviewPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, params } from "@/lib/routing";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await routeParams;
  const canonicalUrl = canonical.review({ first, second });

  const path = `/${first}/${second}`;  return generateCalculatorMetadata({
    key: params.calculatorKey(path),
    group: params.calculatorGroupKey(path),
    canonicalUrl,
  });
}

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;

  return <ReviewPageWithRouting segments={{ first, second, embed }} />;
}
