import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, ComparisonGrid, type EmbedContextType, HideOnEmbed, WithCondenseOnScroll } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Layout } from "@/components/layout";
import type { AnswersViewModel, CalculatorViewModel, QuestionsViewModel, ResultViewModel } from "@/view-models";

export type ComparisonPage = {
  embedContext: EmbedContextType;
  calculator: CalculatorViewModel;
  result: ResultViewModel;
  answers: AnswersViewModel;
  questions: QuestionsViewModel;
  onPreviousClick: () => void;
  onCloseClick: () => void;
};

export function ComparisonPage({ embedContext, calculator, result, answers, questions, onPreviousClick, onCloseClick }: ComparisonPage) {
  const t = useTranslations("koa.pages");
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
                    <Button variant="link" color="neutral" size="small" aria-label={t("common.close")} onClick={onCloseClick}>
                      <Icon icon={mdiClose} size="medium" decorative />
                    </Button>
                  </HideOnEmbed>
                </AppHeader.Right>
                <AppHeader.Bottom>
                  <AppHeader.BottomLeft condensed={condensed}>
                    <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label={t("comparison.back")}>
                      <Icon icon={mdiArrowLeft} size="medium" decorative />
                    </Button>
                  </AppHeader.BottomLeft>
                  <AppHeader.BottomMain condensed={condensed}>
                    <h3 className="font-display font-semibold text-2xl tracking-tight text-slate-700">{t("comparison.title")}</h3>
                  </AppHeader.BottomMain>
                </AppHeader.Bottom>
              </AppHeader>
            </Layout.Header>
            <Layout.Content fullWidth>
              <ComparisonGrid questions={questions} result={result} answers={answers} condensed={condensed} />
            </Layout.Content>
          </>
        )}
      </WithCondenseOnScroll>
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} lg:hidden`} />}
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} />}</Layout.Footer>
    </Layout>
  );
}
