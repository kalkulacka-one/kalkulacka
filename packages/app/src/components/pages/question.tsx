import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, type EmbedContextType, HideOnEmbed, WithCondenseOnScroll } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Layout } from "@/components/layout";
import { QuestionCard } from "@/components/question-card";
import { QuestionNavigationCard } from "@/components/question-navigation-card";
import { QuestionProgress } from "@/components/question-progress";
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
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;
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
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </Layout.Header>
      <Layout.Content fullWidth>
        {/*
          A dedicated column rather than Layout.Content's own max-width: the
          2026 card is wider than the app's default content column, and this
          screen's step row lives in this same flow (not Layout.BottomNavigation)
          so it renders identically whether or not the shell PR is merged.
        */}
        <div className="koa:mx-auto koa:flex koa:h-full koa:w-full koa:max-w-[51.25rem] koa:flex-1 koa:flex-col koa:gap-4 koa:sm:flex-none koa:sm:gap-6 koa:sm:py-6">
          <QuestionProgress current={number} total={total} />
          <QuestionCard question={question} answer={answer} onAgreeChange={handleAgreeChange} onDisagreeChange={handleDisagreeChange} onImportantChange={handleImportantChange} />
          <QuestionNavigationCard current={number} total={total} isAnswered={isAnswered} onPreviousClick={onPreviousClick} onNextClick={onNextClick} />
        </div>
      </Layout.Content>
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} koa:lg:hidden`} />}
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
