import React from "react";

import type { CalculatorViewModel, ResultViewModel } from "../../../view-models";
import { AppHeader, DonateCard, MatchCard, WithCondenseOnScroll } from "../../client";
import { Layout } from "../components";

export type PublicResultPageProps = {
  result: ResultViewModel;
  calculator: CalculatorViewModel;
  showOnlyNested: boolean;
  onFilterChange: (showOnlyNested: boolean) => void;
  donateCardPosition: number | false;
};

export function PublicResultPage({ result, calculator, showOnlyNested, onFilterChange, donateCardPosition }: PublicResultPageProps) {
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
                  <h3 className="font-display font-semibold text-2xl tracking-tight text-slate-700">Můj výsledek</h3>
                </AppHeader.BottomMain>
              </AppHeader.Bottom>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </Layout.Header>
      <Layout.Content>
        {shouldShowToggleComputed && (
          <div className="mb-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="relative bg-slate-100 rounded-full p-1 flex  w-full sm:w-auto text-center">
                <label className={`grow px-4 py-2 rounded-full cursor-pointer transition-colors ${!showOnlyNested ? "bg-slate-700 text-slate-50" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                  <input type="radio" name="resultView" checked={!showOnlyNested} onChange={() => onFilterChange(false)} className="sr-only" />
                  Kandidátní listiny
                </label>
                <label className={`grow px-4 py-2 rounded-full cursor-pointer transition-colors ${showOnlyNested ? "bg-slate-700 text-slate-50" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                  <input type="radio" name="resultView" checked={showOnlyNested} onChange={() => onFilterChange(true)} className="sr-only" />
                  Lidé
                </label>
              </div>
            </div>
          </div>
        )}
        <div className="grid gap-4">
          {donateCardPosition === 0 && <DonateCard />}
          {result.matches.map((match, index) => (
            <React.Fragment key={match.candidate.id}>
              <MatchCard {...match} />
              {donateCardPosition !== false && donateCardPosition > 0 && index === donateCardPosition - 1 && <DonateCard />}
            </React.Fragment>
          ))}
        </div>
      </Layout.Content>
    </Layout>
  );
}
