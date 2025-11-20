import type { Metadata } from "next";

import { IntroductionPageWithRouting } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { canonical, params as routeParams } from "@/lib/routing";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string }> }): Promise<Metadata> {
  const { first, second, third } = await params;
  const canonicalUrl = canonical.introduction({ first, second, third });
  const path = `/${first}/${second}/${third}`;
  return generateCalculatorMetadata({
    key: routeParams.calculatorKey(path),
    group: routeParams.calculatorGroupKey(path),
    canonicalUrl,
  });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  return <IntroductionPageWithRouting segments={{ first, second, third }} />;
}
