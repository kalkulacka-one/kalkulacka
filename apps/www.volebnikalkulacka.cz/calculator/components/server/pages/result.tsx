import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";
import React from "react";

import { HideOnEmbed } from "../../../../components/client";
import type { CalculatorViewModel, ResultViewModel } from "../../../view-models";
import { AppHeader, AppHeaderBottom, AppHeaderBottomLeft, AppHeaderBottomMain, AppHeaderMain, AppHeaderRight, DonateCard, WithCondenseOnScroll } from "../../client";
import { LayoutContent, LayoutHeader, MatchCard } from "../components";

export type ResultPage = {
  result: ResultViewModel;
  calculator: CalculatorViewModel;
  onPreviousClick: () => void;
  onCloseClick: () => void;
  showOnlyNested: boolean;
  onFilterChange: (showOnlyNested: boolean) => void;
  donateCardPosition: number | false;
};

export function ResultPage({ result, calculator, onPreviousClick, onCloseClick, showOnlyNested, onFilterChange, donateCardPosition }: ResultPage) {
  const title = "Volební kalkulačka";

  const hasNestedCandidates = result.matches.some((match) => match.nestedMatches && match.nestedMatches.length > 0);
  const shouldShowToggleComputed = hasNestedCandidates || showOnlyNested;

  return (
    <>
      <LayoutHeader>
        <WithCondenseOnScroll>
          {(condensed) => (
            <AppHeader condensed={condensed} logoTitle={title}>
              <AppHeaderMain title={title} calculator={calculator} />
              <AppHeaderRight>
                <HideOnEmbed>
                  <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                    <Icon icon={mdiClose} size="medium" decorative />
                  </Button>
                </HideOnEmbed>
              </AppHeaderRight>
              <AppHeaderBottom>
                <AppHeaderBottomLeft condensed={condensed}>
                  <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label="Back">
                    <Icon icon={mdiArrowLeft} size="medium" decorative />
                  </Button>
                </AppHeaderBottomLeft>
                <AppHeaderBottomMain condensed={condensed}>
                  <h3 className="font-display font-semibold text-xl sm:text-3xl">Výsledek</h3>
                </AppHeaderBottomMain>
              </AppHeaderBottom>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </LayoutHeader>
      <LayoutContent>
        {shouldShowToggleComputed && (
          <div className="mb-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="relative bg-gray-100 rounded-full p-1 flex">
                <label
                  className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${!showOnlyNested ? "bg-[var(--ko-color-primary)] text-[var(--ko-color-on-bg-primary)]" : "text-[var(--ko-color-neutral)] hover:text-[var(--ko-color-neutral-hover)]"}`}
                >
                  <input type="radio" name="resultView" checked={!showOnlyNested} onChange={() => onFilterChange(false)} className="sr-only" />
                  Kandidátní listiny
                </label>
                <label
                  className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${showOnlyNested ? "bg-[var(--ko-color-primary)] text-[var(--ko-color-on-bg-primary)]" : "text-[var(--ko-color-neutral)] hover:text-[var(--ko-color-neutral-hover)]"}`}
                >
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
      </LayoutContent>
    </>
  );
}
