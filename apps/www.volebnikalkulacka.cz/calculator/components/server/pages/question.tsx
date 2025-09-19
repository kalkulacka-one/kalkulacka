import { mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import { type EmbedContextType, HideOnEmbed } from "../../../../components/client";
import type { AnswersViewModel, AnswerViewModel, CalculatorViewModel, QuestionsViewModel, QuestionViewModel } from "../../../view-models";
import { AppHeader, WithCondenseOnScroll } from "../../client";
import { EmbedFooter, Layout, QuestionCard, QuestionNavigationCard, QuestionProgressBar } from "../components";

export type QuestionPage = {
  embedContext: EmbedContextType;
  question: QuestionViewModel;
  questions: QuestionsViewModel;
  number: number;
  total: number;
  answer: AnswerViewModel;
  answers: AnswersViewModel;
  calculator: CalculatorViewModel;
  onPreviousClick: () => void;
  onNextClick: () => void;
  onCloseClick: () => void;
};

export function QuestionPage({ embedContext, question, questions, number, total, calculator, onPreviousClick, onNextClick, answer, answers, onCloseClick }: QuestionPage) {
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

  const handleAgreeChange = (checked: boolean) => {
    if (checked) {
      answer.setAnswer({
        questionId: question.id,
        answer: true,
      });
      onNextClick();
    } else {
      answer.setAnswer({
        questionId: question.id,
        answer: undefined,
      });
    }
  };

  const handleDisagreeChange = (checked: boolean) => {
    if (checked) {
      answer.setAnswer({
        questionId: question.id,
        answer: false,
      });
      onNextClick();
    } else {
      answer.setAnswer({
        questionId: question.id,
        answer: undefined,
      });
    }
  };

  const handleImportantChange = (checked: boolean) => {
    answer.setAnswer({
      questionId: question.id,
      isImportant: checked,
    });
  };

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
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </Layout.Header>
      <Layout.Content>
        <div className="flex flex-col gap-4">
          <QuestionCard question={question} current={number} total={total} />
          <QuestionProgressBar questions={questions} current={number} answers={answers} />
        </div>
      </Layout.Content>
      <Layout.BottomSpacer className={QuestionNavigationCard.heightClassNames} />
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} lg:hidden`} />}
      <Layout.BottomNavigation className={hasFooter ? `${EmbedFooter.marginBottomClassNames} lg:mb-0` : undefined}>
        <QuestionNavigationCard
          current={number}
          total={total}
          onPreviousClick={onPreviousClick}
          onNextClick={onNextClick}
          answer={answer}
          onAgreeChange={handleAgreeChange}
          onDisagreeChange={handleDisagreeChange}
          onImportantChange={handleImportantChange}
        />
      </Layout.BottomNavigation>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} />}</Layout.Footer>
    </Layout>
  );
}
