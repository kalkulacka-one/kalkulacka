import type { Metadata } from "next";
import type { Locale } from "next-intl";

import { ComparisonPageWithRouting } from "@/components/client";
import { calculatorMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; first: string; second: string; third: string }> }): Promise<Metadata> {
  const { locale, ...segments } = await params;
  return calculatorMetadata.comparison(segments, locale);
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string }> }) {
  const segments = await params;
  return <ComparisonPageWithRouting segments={segments} />;
}
