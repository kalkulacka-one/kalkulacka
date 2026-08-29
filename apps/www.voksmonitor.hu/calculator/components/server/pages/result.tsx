"use client";

import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";
import React from "react";

import { type EmbedContextType, HideOnEmbed } from "../../../../components/client";
import type { CalculatorViewModel, ResultViewModel } from "../../../view-models";
import { AppHeader, DonateCard, MatchCard, ShareDropdown, WithCondenseOnScroll } from "../../client";
import { EmbedFooter, Layout } from "../components";

export type ResultPage = {
  embedContext: EmbedContextType;
  result: ResultViewModel;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onPreviousClick: () => void;
  onCloseClick: () => void;
  shareUrl?: string;
  showOnlyNested: boolean;
  onFilterChange: (showOnlyNested: boolean) => void;
  donateCardPosition: number | false;
  showAllParties?: boolean;
  onShowAllPartiesChange?: (showAll: boolean) => void;
};

export function ResultPage({
  embedContext,
  result,
  calculator,
  onNextClick,
  onPreviousClick,
  onCloseClick,
  showOnlyNested,
  onFilterChange,
  donateCardPosition,
  showAllParties,
  onShowAllPartiesChange,
  shareUrl,
}: ResultPage) {
  const t = useTranslations("calculator.result");
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
                  <Button variant="link" color="neutral" size="small" aria-label={t("close-aria-label")} title={t("close-aria-label")} onClick={onCloseClick}>
                    <Icon icon={mdiClose} size="medium" decorative />
                  </Button>
                </HideOnEmbed>
              </AppHeader.Right>
              <AppHeader.Bottom className="w-full">
                <AppHeader.BottomLeft condensed={condensed}>
                  <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label={t("back-aria-label")}>
                    <Icon icon={mdiArrowLeft} size="medium" decorative />
                  </Button>
                </AppHeader.BottomLeft>
                <AppHeader.BottomMain condensed={condensed}>
                  <h3 className="font-display font-semibold text-2xl tracking-tight text-gray-700">{t("heading")}</h3>
                </AppHeader.BottomMain>
                <div className="ml-auto flex items-center gap-2">{shareUrl && <ShareDropdown shareUrl={shareUrl} align={condensed ? "left" : "right"} />}</div>
              </AppHeader.Bottom>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </Layout.Header>
      <Layout.Content>
        {!showAllParties && <h4 className="font-display font-semibold text-xl tracking-tight text-gray-700 mb-2">{t("description")}</h4>}
        {shouldShowToggleComputed && (
          <div className="mb-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="relative bg-gray-100 rounded-full p-1 flex  w-full sm:w-auto text-center">
                <label className={`grow px-4 py-2 rounded-full cursor-pointer transition-colors ${!showOnlyNested ? "bg-gray-700 text-gray-50" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  <input type="radio" name="resultView" checked={!showOnlyNested} onChange={() => onFilterChange(false)} className="sr-only" />
                  {t("factions-label")}
                </label>
                <label className={`grow px-4 py-2 rounded-full cursor-pointer transition-colors ${showOnlyNested ? "bg-gray-700 text-gray-50" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  <input type="radio" name="resultView" checked={showOnlyNested} onChange={() => onFilterChange(true)} className="sr-only" />
                  {t("representatives-label")}
                </label>
              </div>
            </div>
          </div>
        )}
        <div className="grid gap-4 mb-6">
          {result.matches.map((match, index) => (
            <React.Fragment key={match.candidate.id}>
              <MatchCard {...match} />
            </React.Fragment>
          ))}
          {onShowAllPartiesChange && !showAllParties && (
            <div className="flex justify-between gap-4">
              <Button variant="outline" color="neutral" onClick={() => onShowAllPartiesChange(true)}>
                {t("show-all-parties")}
              </Button>
              <Button variant="fill" color="neutral" onClick={onNextClick}>
                {t("comparison-button")}
              </Button>
            </div>
          )}
          {onShowAllPartiesChange && showAllParties && (
            <div className="flex justify-between gap-4">
              <Button variant="outline" color="neutral" onClick={() => onShowAllPartiesChange(false)}>
                {t("show-fewer-parties")}
              </Button>
              <Button variant="fill" color="neutral" onClick={onNextClick}>
                {t("comparison-button")}
              </Button>
            </div>
          )}
        </div>
        <DonateCard />
      </Layout.Content>
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} lg:hidden`} />}
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} />}</Layout.Footer>
    </Layout>
  );
}
