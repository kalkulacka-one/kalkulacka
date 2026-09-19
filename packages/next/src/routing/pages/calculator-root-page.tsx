import { CalculatorPickerPage, calculatorPickerViewModel, ifFound, loadCalculatorGroup, loadElection } from "@kalkulacka-one/app";
import type { EmbedContextType } from "@kalkulacka-one/app/client";

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { now } from "@/routing/clock";
import type { Routes } from "@/routing/factories/route-builders";
import type { Canonical } from "@/routing/factories/url-builders";
import { resolveGroupSegment } from "@/routing/group-resolution";
import { calculatorExistsGuard } from "@/routing/guards/calculator-exists";
import type { RouteSegments } from "@/routing/segments";

import { loadGroupCalculators } from "./load-group-calculators";

export type CalculatorRootPage = {
  endpoint: string;
  segments: RouteSegments;
  locale: string;
  embedContext: EmbedContextType;
  routes: Routes;
  canonical: Canonical;
  homepageHref: string;
  privacyHref?: string;
};

export async function CalculatorRootPage({ endpoint, segments, locale, embedContext, routes, homepageHref, privacyHref }: CalculatorRootPage) {
  const groupKey = segments.second;
  const segment = segments.third;
  if (!groupKey || !segment) notFound();

  const [group, election] = await Promise.all([ifFound(loadCalculatorGroup({ endpoint, group: groupKey })), ifFound(loadElection({ endpoint, group: groupKey }))]);
  if (!group) {
    await calculatorExistsGuard({ endpoint, key: segment, group: groupKey });
    redirect(routes.introduction(segments, locale));
  }

  const resolution = resolveGroupSegment({ group, election, segment });
  if (!resolution) notFound();
  if (resolution.kind === "calculator") {
    redirect(routes.introduction({ ...segments, third: resolution.key }, locale));
  }

  const calculators = await loadGroupCalculators({ endpoint, group: groupKey, keys: resolution.calculators.map((item) => item.key) });
  const picker = calculatorPickerViewModel(resolution.district, resolution.calculators, calculators, (key) => routes.introduction({ ...segments, third: key }, locale), now());
  const headingTitle = election?.shortTitle ?? election?.title ?? group.title;
  const heading = headingTitle ? { title: headingTitle } : undefined;

  return <CalculatorPickerPage embedContext={embedContext} picker={picker} heading={heading} closeHref={homepageHref} homepageHref={homepageHref} privacyHref={privacyHref} />;
}

export async function calculatorRootMetadata({ endpoint, segments, canonical }: Pick<CalculatorRootPage, "endpoint" | "segments" | "canonical">): Promise<Metadata> {
  if (!segments.second || !segments.third) return {};
  const [group, election] = await Promise.all([ifFound(loadCalculatorGroup({ endpoint, group: segments.second })), ifFound(loadElection({ endpoint, group: segments.second }))]);
  if (!group) return {};
  const resolution = resolveGroupSegment({ group, election, segment: segments.third });
  if (resolution?.kind !== "calculator-picker") return {};
  return { title: resolution.district.title, description: election?.description, alternates: { canonical: canonical.base(segments) } };
}
