import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, Closable, ComparisonGrid, type EmbedContextType, WithCondenseOnScroll } from "@/client";
import { AppLayout } from "@/components/app-layout";
import { EmbedFooter } from "@/components/embed-footer";
import { EmbedLayout } from "@/components/embed-layout";
import type { AnswersViewModel, CalculatorViewModel, QuestionsViewModel, ResultViewModel } from "@/view-models";

export type ComparisonPage = {
  embedContext: EmbedContextType;
  homepageHref: string;
  privacyHref?: string;
  calculator: CalculatorViewModel;
  result: ResultViewModel;
  answers: AnswersViewModel;
  questions: QuestionsViewModel;
  onPreviousClick: () => void;
  onCloseClick: () => void;
};

export function ComparisonPage({ embedContext, homepageHref, privacyHref, calculator, result, answers, questions, onPreviousClick, onCloseClick }: ComparisonPage) {
  const t = useTranslations("koa.pages");

  const Layout = embedContext.isEmbed ? EmbedLayout : AppLayout;

  return (
    <Layout>
      <WithCondenseOnScroll>
        {(condensed) => (
          <>
            <Layout.Header fixed>
              <AppHeader condensed={condensed} calculator={calculator}>
                <AppHeader.Right>
                  <Closable>
                    <Button variant="link" color="neutral" size="small" aria-label={t("common.closeCalculator")} title={t("common.closeCalculator")} onClick={onCloseClick}>
                      <Icon icon={mdiClose} size="medium" decorative />
                    </Button>
                  </Closable>
                </AppHeader.Right>
                <AppHeader.Bottom>
                  <AppHeader.BottomLeft condensed={condensed}>
                    <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label={t("comparison.back")} title={t("comparison.back")}>
                      <Icon icon={mdiArrowLeft} size="medium" decorative />
                    </Button>
                  </AppHeader.BottomLeft>
                  <AppHeader.BottomMain condensed={condensed}>
                    <h3 className="koa:font-display koa:font-semibold koa:text-2xl koa:tracking-tight koa:text-text-strong">{t("comparison.title")}</h3>
                  </AppHeader.BottomMain>
                </AppHeader.Bottom>
              </AppHeader>
            </Layout.Header>
            <Layout.Body>
              <Layout.Content fullWidth>
                <ComparisonGrid questions={questions} result={result} answers={answers} condensed={condensed} />
              </Layout.Content>
            </Layout.Body>
          </>
        )}
      </WithCondenseOnScroll>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
