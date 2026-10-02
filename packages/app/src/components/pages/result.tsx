import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose, mdiExportVariant } from "@mdi/js";
import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { AppHeader, type EmbedContextType, HideOnEmbed, MatchCard } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Layout } from "@/components/layout";
import { ResultNavigationCard } from "@/components/result-navigation-card";
import type { CalculatorViewModel, ResultViewModel } from "@/view-models";

export type ResultPage = {
  embedContext: EmbedContextType;
  homepageHref: string;
  privacyHref?: string;
  result: ResultViewModel;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onPreviousClick: () => void;
  onCloseClick: () => void;
  onShareClick: () => void;
  showOnlyNested: boolean;
  onFilterChange: (showOnlyNested: boolean) => void;
  donateCardPosition: number | false;
  donateCard?: ReactNode;
};

export function ResultPage({
  embedContext,
  homepageHref,
  privacyHref,
  result,
  calculator,
  onNextClick,
  onPreviousClick,
  onCloseClick,
  onShareClick,
  showOnlyNested,
  onFilterChange,
  donateCardPosition,
  donateCard,
}: ResultPage) {
  const t = useTranslations("koa.pages");
  const tResultNavigationCard = useTranslations("koa.components.resultNavigationCard");
  const hasNestedCandidates = result.matches.some((match) => match.nestedMatches && match.nestedMatches.length > 0);
  const shouldShowToggleComputed = hasNestedCandidates || showOnlyNested;
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

  // Local to this page head, not a shared Button variant: the 2026 look's back/share controls
  // are light pills, distinct from the design system's brand-cornered Button.
  const pillButtonClasses =
    "koa:inline-flex koa:items-center koa:gap-1.5 koa:rounded-pill koa:border koa:border-border koa:bg-surface koa:px-4 koa:py-2 koa:text-sm koa:font-semibold koa:text-text-strong koa:hover:bg-surface-hover koa:transition-colors";

  return (
    <Layout>
      <Layout.Header>
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <HideOnEmbed>
              <Button variant="link" color="neutral" size="small" aria-label={t("common.close")} onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </HideOnEmbed>
          </AppHeader.Right>
        </AppHeader>
      </Layout.Header>
      <Layout.Content>
        {/*
         * Layout.Content's own padding (p-2/sm:p-4) is shell-owned; cancelled
         * here and replaced with the 2026 fluid gutter (18px on phones, up to
         * 44px) local to this page's column rather than edited upstream.
         */}
        <div className="koa:-mx-2 koa:sm:-mx-4 koa:px-gutter">
          <div className="koa:flex koa:items-center koa:justify-between koa:gap-2 koa:mb-4">
            <button type="button" className={pillButtonClasses} onClick={onPreviousClick}>
              <Icon icon={mdiArrowLeft} size="small" decorative />
              {t("result.back")}
            </button>
            <button type="button" className={pillButtonClasses} onClick={onShareClick}>
              <Icon icon={mdiExportVariant} size="small" decorative />
              {tResultNavigationCard("shareButton")}
            </button>
          </div>
          <h3 className="koa:font-display koa:font-bold koa:text-display koa:tracking-tight koa:text-text koa:mb-4 koa:sm:mb-6">{t("result.title")}</h3>
          {shouldShowToggleComputed && (
            <div className="koa:mb-6">
              <div className="koa:flex koa:items-center koa:gap-3 koa:text-sm">
                <div className="koa:relative koa:bg-slate-100 koa:rounded-full koa:p-1 koa:flex  koa:w-full koa:sm:w-auto koa:text-center">
                  <label
                    className={`koa:grow koa:px-4 koa:py-2 koa:rounded-full koa:cursor-pointer koa:transition-colors ${!showOnlyNested ? "koa:bg-slate-700 koa:text-slate-50" : "koa:bg-slate-100 koa:text-slate-700 koa:hover:bg-slate-200"}`}
                  >
                    <input type="radio" name="resultView" checked={!showOnlyNested} onChange={() => onFilterChange(false)} className="koa:sr-only" />
                    {t("result.candidateLists")}
                  </label>
                  <label
                    className={`koa:grow koa:px-4 koa:py-2 koa:rounded-full koa:cursor-pointer koa:transition-colors ${showOnlyNested ? "koa:bg-slate-700 koa:text-slate-50" : "koa:bg-slate-100 koa:text-slate-700 koa:hover:bg-slate-200"}`}
                  >
                    <input type="radio" name="resultView" checked={showOnlyNested} onChange={() => onFilterChange(true)} className="koa:sr-only" />
                    {t("result.people")}
                  </label>
                </div>
              </div>
            </div>
          )}
          <div className="koa:grid koa:gap-4">
            {donateCardPosition === 0 && donateCard}
            {result.matches.map((match, index) => (
              <React.Fragment key={match.candidate.id}>
                <MatchCard {...match} />
                {donateCardPosition !== false && donateCardPosition > 0 && index === donateCardPosition - 1 && donateCard}
              </React.Fragment>
            ))}
          </div>
          {/*
           * "Porovnat" in the page's own normal flow, under the list — not a
           * `position: fixed` bottom bar, which iOS Safari's glass bar clips on
           * phones (see rules.md / the iOS Safari note in 2026's globals.css).
           * Sharing is not repeated here: it stays the single top pill above.
           */}
          <div className="koa:mt-6 koa:mb-2">
            <ResultNavigationCard onNextClick={onNextClick} />
          </div>
        </div>
      </Layout.Content>
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} koa:lg:hidden`} />}
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
