import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import { HideOnEmbed } from "../../../../components/client";
import type { AnswersViewModel, CalculatorViewModel, QuestionsViewModel, ResultViewModel } from "../../../view-models";
import { AppHeader, WithCondenseOnScroll } from "../../client";
import { ComparisonGrid, Layout } from "../components";

export type ComparisonPage = {
  calculator: CalculatorViewModel;
  result: ResultViewModel;
  answers: AnswersViewModel;
  questions: QuestionsViewModel;
  onPreviousClick: () => void;
  onCloseClick: () => void;
  attribution?: boolean;
};

export function ComparisonPage({ calculator, result, onPreviousClick, onCloseClick, questions, answers }: ComparisonPage) {
  return (
    <>
      <Layout.Header>
        <WithCondenseOnScroll>
          {(condensed) => (
            <AppHeader condensed={condensed} calculator={calculator} fixed>
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
          )}
        </WithCondenseOnScroll>
      </Layout.Header>
      <Layout.Content fullWidth>
        <ComparisonGrid result={result} questions={questions} answers={answers} />
      </Layout.Content>
    </>
  );
}
