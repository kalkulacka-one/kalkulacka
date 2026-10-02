import { Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, type EmbedContextType, HideOnEmbed } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Layout } from "@/components/layout";
import { ReviewNavigationCard } from "@/components/review-navigation-card";
import { ReviewQuestionCard } from "@/components/review-question-card";
import type { AnswersViewModel, CalculatorViewModel, QuestionsViewModel } from "@/view-models";

export type ReviewPage = {
  embedContext: EmbedContextType;
  homepageHref: string;
  privacyHref?: string;
  questions: QuestionsViewModel;
  answers: AnswersViewModel;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onPreviousClick: () => void;
  onCloseClick: () => void;
};

export function ReviewPage({ embedContext, homepageHref, privacyHref, questions, answers, calculator, onNextClick, onPreviousClick, onCloseClick }: ReviewPage) {
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
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <HideOnEmbed>
              <AppHeader.IconButton aria-label={t("common.close")} onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </AppHeader.IconButton>
            </HideOnEmbed>
          </AppHeader.Right>
        </AppHeader>
      </Layout.Header>
      <Layout.Content>
        <button
          type="button"
          onClick={onPreviousClick}
          className="koa:inline-flex koa:items-center koa:gap-1.5 koa:rounded-pill koa:border koa:border-border koa:px-3 koa:py-1.5 koa:text-sm koa:text-text-muted koa:mb-4 koa:hover:bg-surface-sunken"
        >
          <Icon icon={mdiArrowLeft} size="small" decorative />
          {t("review.back")}
        </button>
        <h3 className="koa:font-display koa:font-bold koa:text-display koa:tracking-tight koa:text-text koa:mb-4 koa:sm:mb-6">{t("review.title")}</h3>
        <div className="koa:grid koa:gap-2">
          {questions.questions.map((question) => {
            const answer = answers.answers.find((a) => a.answer?.questionId === question.id) || {
              answer: undefined,
              setAnswer: answers.setAnswer,
            };

            return (
              <ReviewQuestionCard
                key={question.id}
                question={question}
                answer={answer}
                onAgreeChange={(agree) => handleAgreeChange(question.id, agree)}
                onDisagreeChange={(disagree) => handleDisagreeChange(question.id, disagree)}
                onImportantChange={(isImportant) => handleImportantChange(question.id, isImportant)}
              />
            );
          })}
        </div>
      </Layout.Content>
      <Layout.BottomSpacer className={ReviewNavigationCard.heightClassNames} />
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} koa:lg:hidden`} />}
      <Layout.BottomNavigation className={hasFooter ? "koa:bottom-11" : undefined}>
        <ReviewNavigationCard onNextClick={onNextClick} />
      </Layout.BottomNavigation>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
