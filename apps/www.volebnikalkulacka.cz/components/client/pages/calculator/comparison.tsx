import { type ComparisonFilter, ComparisonPage } from "@kalkulacka-one/app";
import { useCalculatedMatches, useCalculator } from "@kalkulacka-one/app/client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

import { CalculatorMenu, useEmbed } from "@/components/client";
import { calculatorNames } from "@/config/calculator-names";
import { COMPARISON_FILTER_PARAM, comparisonFilterQuery, parseComparisonFilter, type RouteSegments, routes } from "@/lib/routing";

export function ComparisonPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const calculator = useCalculator();
  const embed = useEmbed();
  const algorithmMatches = useCalculatedMatches();
  const locale = useLocale();

  // A group calculator (`snemovni-2025/kalkulacka`) is named by its group and
  // variant keys; a standalone one by its own key. Neither carries a display
  // name in the data, hence the config.
  const { electionName, calculatorName } = calculatorNames({
    group: "calculatorGroup" in calculator ? calculator.calculatorGroup.key : undefined,
    key: ("variant" in calculator ? calculator.variant?.key : undefined) ?? calculator.key,
    fallback: calculator.title || undefined,
  });

  // In an embed the wordmark doubles as the attribution — the one way out of a
  // partner's iframe to the full site — unless the partner opted out of it.
  const attributionHref = embed.isEmbed && embed.config?.attribution !== false ? (process.env.NEXT_PUBLIC_CANONICAL_URL ?? "/") : undefined;
  const logoMonochrome = embed.isEmbed && embed.config?.logo === "monochrome";

  const comparisonRoute = routes.comparison(segments, locale);

  /*
   * `?filtr=dulezite` or `?filtr=<topic slug>`, as the results page's dashboard
   * links write it. Read once, on arrival: the page keeps its own filter from
   * there, and `handleFilterChange` keeps the address bar in step.
   */
  const initialFilter = parseComparisonFilter(searchParams.get(COMPARISON_FILTER_PARAM));

  const handleBackClick = () => {
    router.push(routes.result(segments, locale));
  };

  const handleFilterChange = (filter: ComparisonFilter | undefined) => {
    // The URL keeps up without a navigation: the screen already has the data
    // for every filter, and a server round-trip would only re-fetch it.
    window.history.replaceState(null, "", `${comparisonRoute}${comparisonFilterQuery(filter)}`);
  };

  return (
    <ComparisonPage
      appTitle="Volební kalkulačka"
      electionName={electionName}
      calculatorName={calculatorName}
      initialFilter={initialFilter}
      headerActions={<CalculatorMenu segments={segments} matches={algorithmMatches} />}
      attributionHref={attributionHref}
      logoMonochrome={logoMonochrome}
      onBackClick={handleBackClick}
      onFilterChange={handleFilterChange}
    />
  );
}
