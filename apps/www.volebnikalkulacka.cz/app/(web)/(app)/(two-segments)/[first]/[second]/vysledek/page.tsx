import type { Metadata } from "next";

import { ResultPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, params } from "@/lib/routing";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await routeParams;
  const canonicalUrl = canonical.result({ first, second });

  return generateCalculatorMetadata({
    key: params.twoSegment.calculatorKey(first, second),
    group: params.twoSegment.calculatorGroupKey(first, second),
    canonicalUrl,
  });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  return <ResultPageWithRouting segments={{ first, second }} />;
}
