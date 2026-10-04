import { Button, Icon } from "@kalkulacka-one/design-system/client";
import { SteppedProgressBar } from "@kalkulacka-one/design-system/server";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, type EmbedContextType, HideOnEmbed, WithCondenseOnScroll } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
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
                  <Button variant="round" color="neutral" size="small" aria-label={t("common.close")} onClick={onCloseClick}>
                    <Icon icon={mdiClose} size="medium" decorative />
                  </Button>
                </HideOnEmbed>
              </AppHeader.Right>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </Layout.Header>
      <Layout.Content fullWidth>
        <div>
          {/*
            A dedicated column rather than Layout.Content's own max-width: the
            2026 card is wider than the app's default content column, and this
            screen's step row lives in this same flow (not Layout.BottomNavigation)
            so it renders identically whether or not the shell PR is merged.

            Sized to the layout viewport (`lvh`), not the dynamic one (`dvh`):
            this screen never scrolls, so iOS Safari's address bar never gets a
            scroll gesture to minimise on its own and `dvh` is stuck reporting
            its most pessimistic (bar-expanded) reading — on iOS 26 that is
            ~47px short of the bar's real position, which left the step row
            floating well above it with dead space below. `lvh` is 2026's fix
            for this same "pinned, never-scrolling screen" case (see its
            `globals.css`): it reads the full layout viewport regardless of bar
            state, and since this column's own height is capped there (nothing
            here ever overflows it — the card's `overflow-y-auto` absorbs long
            text instead, see question-card.tsx), there is nothing for the
            extra height to scroll.

            Bottom padding on this same column — not extra height — keeps the
            step row off the viewport edge (2026's `.center` gives it
            `padding-bottom: max(1rem, env(safe-area-inset-bottom))`, same idea
            here): the column's height stays `100lvh - header`, so the padding
            is carved out of its own flex content rather than pushing the total
            past the viewport.
          */}
          <div className="koa:mx-auto koa:flex koa:h-[calc(100lvh-5rem)] koa:w-full koa:min-w-0 koa:max-w-[51.25rem] koa:flex-1 koa:flex-col koa:gap-4 koa:pb-6 koa:sm:flex-none koa:sm:gap-6 koa:sm:py-6">
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
        </div>
      </Layout.Content>
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} koa:lg:hidden`} />}
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
