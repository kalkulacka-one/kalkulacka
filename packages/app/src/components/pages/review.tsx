import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, Closable, type EmbedContextType } from "@/client";
import { AppLayout } from "@/components/app-layout";
import { EmbedFooter } from "@/components/embed-footer";
import { EmbedLayout } from "@/components/embed-layout";
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

  const Layout = embedContext.isEmbed ? EmbedLayout : AppLayout;

  return (
    <Layout>
      <Layout.Header>
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <Closable>
              <Button variant="round" color="neutral" size="small" aria-label={t("common.closeCalculator")} title={t("common.closeCalculator")} onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </Closable>
          </AppHeader.Right>
        </AppHeader>
      </Layout.Header>
      <Layout.Body>
        <Layout.Content>
          <div className="koa:mb-4">
            <Button variant="pill" color="neutral" onClick={onPreviousClick}>
              <Icon icon={mdiArrowLeft} size="small" decorative />
              {t("review.back")}
            </Button>
          </div>
          <h3 className="koa:font-display koa:font-bold koa:text-display koa:tracking-tight koa:text-text koa:mb-2 koa:sm:mb-3">{t("review.title")}</h3>
          <p className="koa:mb-5 koa:sm:mb-6 koa:max-w-prose koa:text-text-muted koa:leading-[1.5]">{t("review.description")}</p>
          <div className="koa:grid koa:gap-2 koa:sm:gap-3">
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
        <Layout.BottomNavigation>
          <ReviewNavigationCard onNextClick={onNextClick} />
        </Layout.BottomNavigation>
      </Layout.Body>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
