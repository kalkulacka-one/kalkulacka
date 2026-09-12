import { useTranslations } from "next-intl";

import { AppHeader, MatchCard, WithCondenseOnScroll } from "@/client";
import { Layout } from "@/components/layout";
import { PublicResultNavigationCard } from "@/components/public-result-navigation-card";
import type { CalculatorViewModel, ResultViewModel } from "@/view-models";

export type PublicResultPageProps = {
  result: ResultViewModel;
  calculator: CalculatorViewModel;
  showOnlyNested: boolean;
  onFilterChange: (showOnlyNested: boolean) => void;
  onStartCalculator: () => void;
};

export function PublicResultPage({ result, calculator, showOnlyNested, onFilterChange, onStartCalculator }: PublicResultPageProps) {
  const t = useTranslations("koa.pages");
  const hasNestedCandidates = result.matches.some((match) => match.nestedMatches && match.nestedMatches.length > 0);
  const shouldShowToggleComputed = hasNestedCandidates || showOnlyNested;

  return (
    <Layout>
      <Layout.Header>
        <WithCondenseOnScroll>
          {(condensed) => (
            <AppHeader condensed={condensed} calculator={calculator}>
              <AppHeader.Bottom>
                <AppHeader.BottomMain condensed={condensed}>
                  <h3 className="koa:font-display koa:font-semibold koa:text-2xl koa:tracking-tight koa:text-slate-700">{t("publicResult.title")}</h3>
                </AppHeader.BottomMain>
              </AppHeader.Bottom>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </Layout.Header>
      <Layout.Content>
        {shouldShowToggleComputed && (
          <div className="koa:mb-6">
            <div className="koa:flex koa:items-center koa:gap-3 koa:text-sm">
              <div className="koa:relative koa:bg-slate-100 koa:rounded-full koa:p-1 koa:flex  koa:w-full koa:sm:w-auto koa:text-center">
                <label
                  className={`koa:grow koa:px-4 koa:py-2 koa:rounded-full koa:cursor-pointer koa:transition-colors ${!showOnlyNested ? "koa:bg-slate-700 koa:text-slate-50" : "koa:bg-slate-100 koa:text-slate-700 koa:hover:bg-slate-200"}`}
                >
                  <input type="radio" name="resultView" checked={!showOnlyNested} onChange={() => onFilterChange(false)} className="koa:sr-only" />
                  {t("publicResult.candidateLists")}
                </label>
                <label
                  className={`koa:grow koa:px-4 koa:py-2 koa:rounded-full koa:cursor-pointer koa:transition-colors ${showOnlyNested ? "koa:bg-slate-700 koa:text-slate-50" : "koa:bg-slate-100 koa:text-slate-700 koa:hover:bg-slate-200"}`}
                >
                  <input type="radio" name="resultView" checked={showOnlyNested} onChange={() => onFilterChange(true)} className="koa:sr-only" />
                  {t("publicResult.people")}
                </label>
              </div>
            </div>
          </div>
        )}
        <div className="koa:grid koa:gap-4">
          {result.matches.map((match) => (
            <MatchCard key={match.candidate.id} {...match} />
          ))}
        </div>
      </Layout.Content>
      <Layout.BottomSpacer className={PublicResultNavigationCard.heightClassNames} />
      <Layout.BottomNavigation>
        <PublicResultNavigationCard onStartClick={onStartCalculator} />
      </Layout.BottomNavigation>
    </Layout>
  );
}
