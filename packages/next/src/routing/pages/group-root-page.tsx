import { districtPickerViewModel, ifFound, loadCalculatorGroup, loadElection } from "@kalkulacka-one/app";
import { DistrictPickerPage, type EmbedContextType } from "@kalkulacka-one/app/client";

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { now } from "@/routing/clock";
import type { Routes } from "@/routing/factories/route-builders";
import type { Canonical } from "@/routing/factories/url-builders";
import { calculatorGuard } from "@/routing/guards/calculator";
import type { RouteSegments } from "@/routing/segments";

import { loadGroupCalculators } from "./load-group-calculators";

export type GroupRootPage = {
  endpoint: string;
  segments: RouteSegments;
  locale: string;
  embedContext: EmbedContextType;
  routes: Routes;
  canonical: Canonical;
  homepageHref: string;
  privacyHref?: string;
};

export async function GroupRootPage({ endpoint, segments, locale, embedContext, routes, homepageHref, privacyHref }: GroupRootPage) {
  const groupKey = segments.second;
  if (!groupKey) notFound();

  const [group, election] = await Promise.all([ifFound(loadCalculatorGroup({ endpoint, group: groupKey })), ifFound(loadElection({ endpoint, group: groupKey }))]);
  if (!group?.election || !election) {
    await calculatorGuard({ endpoint, key: groupKey, prefixed: true });
    redirect(routes.introduction(segments, locale));
  }

  const calculators = await loadGroupCalculators({ endpoint, group: groupKey, keys: group.calculators.map((item) => item.key) });
  const picker = districtPickerViewModel({
    group,
    election,
    buildHref: (key) => routes.base({ ...segments, third: key }, locale),
    calculators,
    now: now(),
  });
  const heading = { title: election.shortTitle ?? election.title };

  return <DistrictPickerPage embedContext={embedContext} picker={picker} heading={heading} closeHref={homepageHref} homepageHref={homepageHref} privacyHref={privacyHref} />;
}

export async function groupRootMetadata({ endpoint, segments, canonical }: Pick<GroupRootPage, "endpoint" | "segments" | "canonical">): Promise<Metadata> {
  if (!segments.second) return {};
  const [group, election] = await Promise.all([ifFound(loadCalculatorGroup({ endpoint, group: segments.second })), ifFound(loadElection({ endpoint, group: segments.second }))]);
  if (!group || !election) return {};
  const title = election.title;
  const description = group.description ?? election.description;
  const url = canonical.base(segments);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { card: "summary", ...(process.env.X_HANDLE && { site: process.env.X_HANDLE }), title, description },
  };
}
