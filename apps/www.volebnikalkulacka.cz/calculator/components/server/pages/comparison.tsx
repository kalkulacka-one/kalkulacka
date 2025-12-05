import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";

import { AppHeader, ComparisonGrid, WithCondenseOnScroll } from "@/calculator/client";
import { type EmbedContextType, HideOnEmbed } from "@/components/client";

import type { AnswersViewModel, CalculatorViewModel, QuestionsViewModel, ResultViewModel } from "../../../view-models/server";
import { EmbedFooter, Layout } from "../components";

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
                    <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                      <Icon icon={mdiClose} size="medium" decorative />
                    </Button>
                  </HideOnEmbed>
                </AppHeader.Right>
                <AppHeader.Bottom>
                  <AppHeader.BottomLeft condensed={condensed}>
                    <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label="Zpět na výsledky">
                      <Icon icon={mdiArrowLeft} size="medium" decorative />
                    </Button>
                  </AppHeader.BottomLeft>
                  <AppHeader.BottomMain condensed={condensed}>
                    <h3 className="font-display font-semibold text-2xl tracking-tight text-slate-700">Porovnání</h3>
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
