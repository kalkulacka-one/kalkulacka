import { addLauncherParam } from "@kalkulacka-one/app";

import { redirect } from "next/navigation";
import type { Locale } from "next-intl";

import { parsedParams, routes } from "@/lib/routing";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: Locale; embed: string; first: string }>; searchParams: Promise<{ from?: string | string[] }> }) {
  const { locale, ...segments } = await params;
  const launcher = parsedParams.launcher((await searchParams).from, segments.embed);
  redirect(addLauncherParam(routes.introduction(segments, locale), launcher));
}
