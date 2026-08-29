"use client";

import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { type EmbedContextType, HideOnEmbed } from "../../../../components/client";
import type { CalculatorViewModel, CandidatesAnswersViewModel, CandidateViewModel, QuestionsViewModel } from "../../../view-models";
import { AppHeader, WithCondenseOnScroll } from "../../client";
import { AnswersGrid } from "../../client/answers-grid";
import { EmbedFooter, Layout } from "../components";

export type AnswersPage = {
  embedContext: EmbedContextType;
  calculator: CalculatorViewModel;
  candidates: CandidateViewModel[];
  candidatesAnswers: CandidatesAnswersViewModel;
  questions: QuestionsViewModel;
  onPreviousClick: () => void;
  onCloseClick: () => void;
};

export function AnswersPage({ embedContext, calculator, candidates, candidatesAnswers, questions, onPreviousClick, onCloseClick }: AnswersPage) {
  const t = useTranslations("calculator.answers");
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

  return (
    <Layout>
      <WithCondenseOnScroll>
        {(condensed) => (
          <>
            <Layout.Header fixed>
              <AppHeader condensed={condensed} calculator={calculator}>
                <AppHeader.Right>
                  <HideOnEmbed>
                    <Button variant="link" color="neutral" size="small" aria-label={t("close-aria-label")} title={t("close-aria-label")} onClick={onCloseClick}>
                      <Icon icon={mdiClose} size="medium" decorative />
                    </Button>
                  </HideOnEmbed>
                </AppHeader.Right>
                <AppHeader.Bottom>
                  <AppHeader.BottomLeft condensed={condensed}>
                    <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label={t("back-aria-label")}>
                      <Icon icon={mdiArrowLeft} size="medium" decorative />
                    </Button>
                  </AppHeader.BottomLeft>
                  <AppHeader.BottomMain condensed={condensed}>
                    <h3 className="font-display font-semibold text-2xl tracking-tight text-gray-700">{t("heading")}</h3>
                  </AppHeader.BottomMain>
                </AppHeader.Bottom>
              </AppHeader>
            </Layout.Header>
            <Layout.Content fullWidth>
              <AnswersGrid questions={questions} candidates={candidates} candidatesAnswers={candidatesAnswers} condensed={condensed} />
            </Layout.Content>
          </>
        )}
      </WithCondenseOnScroll>
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} lg:hidden`} />}
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} />}</Layout.Footer>
    </Layout>
  );
}
