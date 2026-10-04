import { Button, Icon } from "@kalkulacka-one/design-system/client";
import { SteppedProgressBar } from "@kalkulacka-one/design-system/server";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { AppHeader, type EmbedContextType, HideOnEmbed, WithCondenseOnScroll } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Layout } from "@/components/layout";
import { QuestionCard } from "@/components/question-card";
import { QuestionNavigationCard } from "@/components/question-navigation-card";
import type { AnswerViewModel, CalculatorViewModel, QuestionViewModel } from "@/view-models";

// How long a chosen answer stays visible as selected before the card leaves, then the card's exit and enter.
// Tuned so the whole step reads as one smooth beat: the fill lands, the card slides away, the next one slides in.
const HOLD_MS = 120;
const EXIT_MS = 140;
const ENTER_MS = 280;
const SHIFT_PX = 28;

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

  // The question card behaves like a deck. Moving to another question (by answering, skipping or going back) slides the
  // current card away, swaps the question, and slides the next one in from the same side. Skipped entirely under
  // prefers-reduced-motion, and while a move is under way further taps are ignored, so a double tap can't answer the
  // next question by accident.
  const deckRef = useRef<HTMLDivElement>(null);
  const direction = useRef<1 | -1>(1);
  const isMoving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const previousQuestionId = useRef(question.id);
  // Set between tapping an answer and the card leaving, so the step row keeps its label instead of flipping to
  // "Next" for a moment and back to "Skip" on the next question.
  const [answeredBeforeTap, setAnsweredBeforeTap] = useState<boolean | undefined>(undefined);
  const isHolding = answeredBeforeTap !== undefined;

  useEffect(() => {
    if (previousQuestionId.current === question.id) {
      return;
    }
    previousQuestionId.current = question.id;
    clearTimeout(timer.current);
    isMoving.current = false;
    setAnsweredBeforeTap(undefined);
    const deck = deckRef.current;
    if (!deck) {
      return;
    }
    for (const animation of deck.getAnimations()) {
      animation.cancel();
    }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      deck.animate(
        [
          { opacity: 0, transform: `translateX(${direction.current * SHIFT_PX}px) scale(0.98)` },
          { opacity: 1, transform: "none" },
        ],
        { duration: ENTER_MS, easing: "cubic-bezier(0.2, 0.9, 0.3, 1)" },
      );
    }
  }, [question.id]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const moveTo = (move: () => void, towards: 1 | -1) => {
    if (isMoving.current) {
      return;
    }
    isMoving.current = true;
    direction.current = towards;
    const deck = deckRef.current;
    if (!deck || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      move();
      return;
    }
    deck.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: `translateX(${-towards * SHIFT_PX}px) scale(0.98)` },
      ],
      { duration: EXIT_MS, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" },
    );
    timer.current = setTimeout(() => {
      move();
      // Leaving the screen (first question back, last question forward) never changes the question; don't stay stuck.
      timer.current = setTimeout(() => {
        isMoving.current = false;
        for (const animation of deck.getAnimations()) {
          animation.cancel();
        }
      }, 600);
    }, EXIT_MS);
  };

  const handleAnswerChange = (value: boolean) => (checked: boolean) => {
    if (isMoving.current || isHolding) {
      return;
    }
    answer.setAnswer({
      questionId: question.id,
      answer: checked ? value : undefined,
    });
    if (checked) {
      setAnsweredBeforeTap(isAnswered);
      timer.current = setTimeout(() => moveTo(onNextClick, 1), HOLD_MS);
    }
  };

  const handleAgreeChange = handleAnswerChange(true);
  const handleDisagreeChange = handleAnswerChange(false);

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
      <Layout.Content fullWidth fill>
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
        <div className="koa:mx-auto koa:flex koa:w-full koa:min-w-0 koa:max-w-[51.25rem] koa:flex-1 koa:flex-col koa:gap-4 koa:pb-6 koa:sm:flex-none koa:sm:gap-6 koa:sm:py-6">
          <SteppedProgressBar
            stepItems={Array.from({ length: total }, (_, index) => ({ id: String(index + 1), status: null }))}
            stepCurrent={number}
            stepTotal={total}
            idKey="id"
            statusKey="status"
            decorative
          />
          <div ref={deckRef} className="koa:flex koa:flex-1 koa:flex-col koa:sm:flex-none">
            <QuestionCard question={question} answer={answer} onAgreeChange={handleAgreeChange} onDisagreeChange={handleDisagreeChange} onImportantChange={handleImportantChange} />
          </div>
          <QuestionNavigationCard
            current={number}
            total={total}
            isAnswered={answeredBeforeTap ?? isAnswered}
            onPreviousClick={() => moveTo(onPreviousClick, -1)}
            onNextClick={() => moveTo(onNextClick, 1)}
          />
        </div>
      </Layout.Content>
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} koa:lg:hidden`} />}
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
