import type { Metadata } from "next";

import { IntroductionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, params } from "@/lib/routing";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await routeParams;
  const canonicalUrl = canonical.introduction({ first, second });

  const path = `/${first}/${second}`;
  return generateCalculatorMetadata({
    key: params.calculatorKey(path),
    group: params.calculatorGroupKey(path),
    canonicalUrl,
  });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; embed: string }> }) {
  const { first, second, embed } = await params;

  return <IntroductionPageWithRouting segments={{ first, second, embed }} />;
}
