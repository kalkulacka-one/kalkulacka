import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import { HideOnEmbed } from "../../../../components/client";
import type { AnswersViewModel, CalculatorViewModel, QuestionsViewModel } from "../../../view-models";
import { AppHeader, AppHeaderBottom, AppHeaderBottomLeft, AppHeaderBottomMain, AppHeaderMain, AppHeaderRight, WithCondenseOnScroll } from "../../client";
import { LayoutBottomNavigation, LayoutContent, LayoutHeader, ReviewNavigationCard, ReviewQuestionCard } from "../components";

export type ReviewPage = {
  questions: QuestionsViewModel;
  answers: AnswersViewModel;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onPreviousClick: () => void;
  onCloseClick: () => void;
  isEmbed?: boolean;
};

export function ReviewPage({ questions, answers, calculator, onNextClick, onPreviousClick, onCloseClick, isEmbed }: ReviewPage) {
  const title = "Volební kalkulačka";
  let secondaryTitle: string | undefined = calculator?.shortTitle;
  let tertiaryTitle: string | undefined = "Sněmovní 2025";
  if (!calculator?.shortTitle) {
    secondaryTitle = "Sněmovní 2025";
    tertiaryTitle = undefined;
  }

  const handleAgreeChange = (questionId: string, agree: boolean) => {
    if (agree) {
      answers.setAnswer({
        questionId,
        answer: true,
      });
    } else {
      answers.setAnswer({
        questionId,
        answer: undefined,
      });
    }
  };

  const handleDisagreeChange = (questionId: string, disagree: boolean) => {
    if (disagree) {
      answers.setAnswer({
        questionId,
        answer: false,
      });
    } else {
      answers.setAnswer({
        questionId,
        answer: undefined,
      });
    }
  };

  const handleImportantChange = (questionId: string, isImportant: boolean) => {
    answers.setAnswer({
      questionId,
      isImportant,
    });
  };

  return (
    <>
      <LayoutHeader>
        <WithCondenseOnScroll>
          {(condensed) => (
            <AppHeader condensed={condensed} logoTitle={title}>
              <AppHeaderMain title={title} secondaryTitle={secondaryTitle} tertiaryTitle={tertiaryTitle} />
              <AppHeaderRight>
                <HideOnEmbed>
                  <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                    <Icon icon={mdiClose} size="medium" decorative />
                  </Button>
                </HideOnEmbed>
              </AppHeaderRight>
              <AppHeaderBottom>
                <AppHeaderBottomLeft condensed={condensed}>
                  <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label="Zpět na otázky">
                    <Icon icon={mdiArrowLeft} size="medium" decorative />
                  </Button>
                </AppHeaderBottomLeft>
                <AppHeaderBottomMain condensed={condensed}>
                  <h3 className="font-display font-semibold text-3xl">Rekapitulace</h3>
                </AppHeaderBottomMain>
              </AppHeaderBottom>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </LayoutHeader>
      <LayoutContent>
        <div className="grid gap-4">
          {questions.questions.map((question, index) => {
            const answer = answers.answers.find((a) => a.answer?.questionId === question.id) || {
              answer: undefined,
              setAnswer: answers.setAnswer,
            };

            return (
              <ReviewQuestionCard
                key={question.id}
                question={question}
                answer={answer}
                current={index + 1}
                total={questions.total}
                onAgreeChange={(agree) => handleAgreeChange(question.id, agree)}
                onDisagreeChange={(disagree) => handleDisagreeChange(question.id, disagree)}
                onImportantChange={(isImportant) => handleImportantChange(question.id, isImportant)}
              />
            );
          })}
        </div>
      </LayoutContent>
      <LayoutBottomNavigation>
        <ReviewNavigationCard onNextClick={onNextClick} attribution={isEmbed} />
      </LayoutBottomNavigation>
    </>
  );
}
