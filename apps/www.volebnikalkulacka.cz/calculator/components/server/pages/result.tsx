import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";
import React from "react";

import { HideOnEmbed } from "../../../../components/client";
import type { CalculatorViewModel, ResultViewModel } from "../../../view-models";
import { AppHeader, DonateCard, WithCondenseOnScroll } from "../../client";
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
  const hasNestedCandidates = result.matches.some((match) => match.nestedMatches && match.nestedMatches.length > 0);
  const shouldShowToggleComputed = hasNestedCandidates || showOnlyNested;

  return (
    <>
      <LayoutHeader>
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
