import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, type EmbedContextType, HideOnEmbed, WithCondenseOnScroll } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Layout } from "@/components/layout";
import { ReviewNavigationCard } from "@/components/review-navigation-card";
import { ReviewQuestionCard } from "@/components/review-question-card";
import type { AnswersViewModel, CalculatorViewModel, QuestionsViewModel } from "@/view-models";

export type ReviewPage = {
  embedContext: EmbedContextType;
  questions: QuestionsViewModel;
  answers: AnswersViewModel;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onPreviousClick: () => void;
  onCloseClick: () => void;
};

export function ReviewPage({ embedContext, questions, answers, calculator, onNextClick, onPreviousClick, onCloseClick }: ReviewPage) {
  const t = useTranslations("koa.pages");
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

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
    <Layout>
      <Layout.Header>
        <WithCondenseOnScroll>
          {(condensed) => (
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
                  <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label={t("review.back")}>
                    <Icon icon={mdiArrowLeft} size="medium" decorative />
                  </Button>
                </AppHeader.BottomLeft>
                <AppHeader.BottomMain condensed={condensed}>
                  <h3 className="font-display font-semibold text-2xl tracking-tight text-slate-700">{t("review.title")}</h3>
                </AppHeader.BottomMain>
              </AppHeader.Bottom>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </Layout.Header>
      <Layout.Content>
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
      </Layout.Content>
      <Layout.BottomSpacer className={ReviewNavigationCard.heightClassNames} />
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} lg:hidden`} />}
      <Layout.BottomNavigation className={hasFooter ? `${EmbedFooter.marginBottomClassNames} lg:mb-0` : undefined}>
        <ReviewNavigationCard onNextClick={onNextClick} />
      </Layout.BottomNavigation>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} />}</Layout.Footer>
    </Layout>
  );
}
