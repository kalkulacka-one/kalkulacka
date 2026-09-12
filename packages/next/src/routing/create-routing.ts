import { createCanonical, createParamsMapper, createPrefixes, createRouteBuilders, createRouteParsers } from "@/routing/factories";
import type { PageType } from "@/routing/localized-slugs";
import type { AppConfig } from "@/types/app-config";

export type RoutingConfig = {
  i18n: AppConfig["i18n"];
  pageSlugs: Record<string, Record<PageType, string>>;
  prefixSlugs: Record<string, Record<string, string>>;
};

export function createRouting({ i18n, pageSlugs, prefixSlugs }: RoutingConfig) {
  const PREFIXES = createPrefixes({ i18n, prefixSlugs });
  const { routes } = createRouteBuilders({ i18n, pageSlugs });
  const { canonical } = createCanonical({ routes });
  const { mappedParams } = createParamsMapper({ prefixes: PREFIXES });
  const { parsedParams } = createRouteParsers({ pageSlugs });

  return { routes, canonical, mappedParams, parsedParams, PREFIXES };
}
