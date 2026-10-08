import { Button, Icon } from "@kalkulacka-one/design-system/client";
import { SteppedProgressBar } from "@kalkulacka-one/design-system/server";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, Closable, type EmbedContextType } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { EmbedLayout } from "@/components/embed-layout";
import { FixedLayout } from "@/components/fixed-layout";
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

  const PageLayout = embedContext.isEmbed ? EmbedLayout : FixedLayout;

  return (
    <PageLayout>
      <PageLayout.Header>
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <Closable>
              <Button variant="round" color="neutral" size="small" aria-label={t("common.closeCalculator")} title={t("common.closeCalculator")} onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </Closable>
          </AppHeader.Right>
        </AppHeader>
      </PageLayout.Header>
      <PageLayout.Content fullWidth fullHeight>
        <div className="koa:mx-auto koa:flex koa:w-full koa:min-w-0 koa:max-w-[51.25rem] koa:min-h-0 koa:flex-1 koa:flex-col koa:gap-4 koa:pb-6 koa:sm:gap-6">
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
