import { Button, Icon } from "@kalkulacka-one/design-system/client";
import { SteppedProgressBar } from "@kalkulacka-one/design-system/server";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, Closable, type EmbedContextType, WithCondenseOnScroll } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { EmbedLayout } from "@/components/embed-layout";
import { Layout } from "@/components/layout";
import { QuestionCard } from "@/components/question-card";
import { QuestionNavigationCard } from "@/components/question-navigation-card";
import type { AnswerViewModel, CalculatorViewModel, QuestionViewModel } from "@/view-models";

export type QuestionPage = {
  embedContext: EmbedContextType;
  homepageHref: string;
  privacyHref?: string;
  question: QuestionViewModel;
  number: number;
  total: number;
  answer: AnswerViewModel;
  calculator: CalculatorViewModel;
  onPreviousClick: () => void;
  onNextClick: () => void;
  onCloseClick: () => void;
};

export function QuestionPage({ embedContext, homepageHref, privacyHref, question, number, total, calculator, onPreviousClick, onNextClick, answer, onCloseClick }: QuestionPage) {
  const t = useTranslations("koa.pages");
  const isAnswered = answer.answer?.answer !== undefined;

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

  const PageLayout = embedContext.isEmbed ? EmbedLayout : Layout;

  return (
    <PageLayout>
      <PageLayout.Header>
        <WithCondenseOnScroll>
          {(condensed) => (
            <AppHeader condensed={condensed} calculator={calculator}>
              <AppHeader.Right>
                <Closable>
                  <Button variant="round" color="neutral" size="small" aria-label={t("common.closeCalculator")} title={t("common.closeCalculator")} onClick={onCloseClick}>
                    <Icon icon={mdiClose} size="medium" decorative />
                  </Button>
                </Closable>
              </AppHeader.Right>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </PageLayout.Header>
      <PageLayout.Content fullWidth fill>
        {/*
          A dedicated column rather than Layout.Content's own max-width: the
          2026 card is wider than the app's default content column, and this
          screen's step row lives in this same flow (not Layout.BottomNavigation)
          so it renders identically whether or not the shell PR is merged.

          The column sizes to its content and the page scrolls when a question
          is taller than the viewport. It used to be pinned to `100lvh - 5rem`
          with the card scrolling inside, which hid the step row under Safari's
          toolbar, trapped the swipe gesture in the card and collapsed the text
          at 400 % zoom. On phones the card stretches (`flex-1`) so the answer
          row stays at the bottom of a short question; on larger screens the
          card has a stable minimum height so the answer row doesn't move.
        */}
        <div className="koa:mx-auto koa:flex koa:w-full koa:min-w-0 koa:max-w-[51.25rem] koa:flex-1 koa:flex-col koa:gap-4 koa:pb-6 koa:sm:flex-none koa:sm:gap-6">
          <SteppedProgressBar
            stepItems={Array.from({ length: total }, (_, index) => ({ id: String(index + 1), status: null }))}
            stepCurrent={number}
            stepTotal={total}
            idKey="id"
            statusKey="status"
            decorative
          />
          <QuestionCard question={question} answer={answer} onAgreeChange={handleAgreeChange} onDisagreeChange={handleDisagreeChange} onImportantChange={handleImportantChange} />
          <QuestionNavigationCard current={number} total={total} isAnswered={isAnswered} onPreviousClick={onPreviousClick} onNextClick={onNextClick} />
        </div>
      </PageLayout.Content>
      <PageLayout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</PageLayout.Footer>
    </PageLayout>
  );
}
