import { ResultNavigationCard } from "@kalkulacka-one/app";
import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";
import React from "react";

import { AppHeader, DonateCard, MatchCard, WithCondenseOnScroll } from "@/calculator/client";
import type { CalculatorViewModel, ResultViewModel } from "@/calculator/view-models/server";
import { type EmbedContextType, HideOnEmbed } from "@/components/client";

import { EmbedFooter, Layout } from "../components";

export type ResultPage = {
  embedContext: EmbedContextType;
  result: ResultViewModel;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onPreviousClick: () => void;
  onCloseClick: () => void;
  onShareClick: () => void;
  showOnlyNested: boolean;
  onFilterChange: (showOnlyNested: boolean) => void;
  donateCardPosition: number | false;
};

export function ResultPage({ embedContext, result, calculator, onNextClick, onPreviousClick, onCloseClick, onShareClick, showOnlyNested, onFilterChange, donateCardPosition }: ResultPage) {
  const hasNestedCandidates = result.matches.some((match) => match.nestedMatches && match.nestedMatches.length > 0);
  const shouldShowToggleComputed = hasNestedCandidates || showOnlyNested;
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

  return (
    <Layout>
      <Layout.Header>
        <WithCondenseOnScroll>
          {(condensed) => (
            <AppHeader condensed={condensed} calculator={calculator}>
              <AppHeader.Right>
                <HideOnEmbed>
                  <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                    <Icon icon={mdiClose} size="medium" decorative />
                  </Button>
                </HideOnEmbed>
              </AppHeader.Right>
              <AppHeader.Bottom>
                <AppHeader.BottomLeft condensed={condensed}>
                  <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label="Back">
                    <Icon icon={mdiArrowLeft} size="medium" decorative />
                  </Button>
                </AppHeader.BottomLeft>
                <AppHeader.BottomMain condensed={condensed}>
                  <h3 className="font-display font-semibold text-2xl tracking-tight text-slate-700">Výsledek</h3>
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
      <Layout.BottomSpacer className={ResultNavigationCard.heightClassNames} />
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} lg:hidden`} />}
      <Layout.BottomNavigation className={hasFooter ? `${EmbedFooter.marginBottomClassNames} lg:mb-0` : undefined}>
        <ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />
      </Layout.BottomNavigation>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} />}</Layout.Footer>
    </Layout>
  );
}
