"use client";

// Ported from kalkulacka-2026/apps/web/components/question-flow.tsx (+ .module.css) and apps/web/lib/question-content.ts
import { FlowNav, type QuestionCardContent, QuestionDeck, type QuestionDeckHandle } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { AppHeader, KeyboardHints, ProgressSegments, Shell, VisuallyHidden } from "@kalkulacka-one/design-system/server";
import type { Question } from "@kalkulacka-one/schema";

import { useTranslations } from "next-intl";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { hasAnswer, isVisited, toSegments } from "@/answers";
import { useAnswersStore } from "@/client/stores";
import { useQuestions } from "@/client/view-models";

export type QuestionPage = {
  /** The header wordmark text, e.g. "Volební kalkulačka" — the product name, owned by the app. */
  appTitle: string;
  /** The election's display name, e.g. "Sněmovní volby 2025". */
  electionName?: string;
  /** The calculator's display name — the header's subtitle. */
  calculatorName: string;
  /** 1-based, from the URL. Only seeds the position; the page owns it from then on. */
  initialPosition: number;
  /** Right side of the header: today the app's close button, later the menu. */
  headerActions?: ReactNode;
  /** Embeds: makes the wordmark an outbound link to the full site. */
  attributionHref?: string;
  logoMonochrome?: boolean;
  /**
   * Called with the new 1-based position on every move, so the app can keep
   * the URL in step.
   *
   * The URL tracks the question so a refresh or a shared link lands in the
   * right place — but the app should do it via `history.replaceState` rather
   * than a router push. Routing on every answer would put a navigation between
   * the swipe and the next card, which is exactly the latency this interaction
   * cannot afford; and one history entry per question would make the back
   * button walk through forty answered cards before leaving the flow.
   */
  onPositionChange: (position: number) => void;
  /** The last card has been committed — the app takes the reader to the recap. */
  onFinish: () => void;
  /** "Návod" on the first question — the app takes the reader back to the guide. */
  onBackToGuide: () => void;
};

/**
 * Domain question -> the shape a `QuestionCard` draws.
 *
 * The seam between the data and the design system, which know nothing of each
 * other by design. It lives in the app package because that is the only layer
 * allowed to see both — and in one place because the deck and, later, the
 * recap's dialog must show the same card, down to which tag counts as the
 * topic.
 */
export function toCardContent(question: Question): QuestionCardContent {
  return {
    id: question.id,
    statement: question.statement,
    title: question.title,
    detail: question.detail,
    topic: question.tags?.[0],
  };
}

/*
 * The deck and its nav, below the shell's header. `min-height: 0` is what
 * keeps the deck inside the viewport: without it this flex child would refuse
 * to shrink below its content's height and push the nav off the bottom edge
 * instead of the card getting shorter.
 */
const flowClasses =
  "koa:flex-1 koa:min-h-0 koa:flex koa:flex-col koa:pl-[calc(var(--ko-spacing-fluid-gutter)+env(safe-area-inset-left,0px))] koa:pr-[calc(var(--ko-spacing-fluid-gutter)+env(safe-area-inset-right,0px))]";

const progressClasses = "koa:flex-none koa:pt-(--ko-spacing-fluid-progress-top) koa:mb-6";

/*
 * The card and the nav below it are centred as one group in the remaining
 * vertical space — not the card alone — so the pair sits together rather than
 * the card floating near the top with the nav stranded far below it.
 *
 * The shell's content column already stops at `dvh`, so on a phone in a
 * browser the bottom padding is only breathing room — the inset itself has a
 * value where there is no address bar to have taken care of it (an installed
 * PWA). Tighter gaps from the `desk` breakpoint (53.75rem, the design system's
 * "a keyboard is assumed" line — spelled out here because the app package has
 * no named breakpoints of its own).
 */
const centerClasses =
  "koa:flex-1 koa:min-h-0 koa:w-full koa:max-w-[51.25rem] koa:mx-auto koa:flex koa:flex-col koa:justify-center koa:gap-6 koa:min-[53.75rem]:gap-2 koa:pb-[max(1rem,env(safe-area-inset-bottom,0px))]";

/*
 * The deck is absolutely positioned inside this box, so the stage owns the
 * card's size. Capping its height on wide screens (rather than letting it fill
 * all remaining space) keeps the statement from floating in an oversized card.
 */
const stageClasses = "koa:relative koa:flex-1 koa:min-h-0 koa:w-full koa:min-[53.75rem]:flex-[0_1_33.75rem]";

/**
 * The question flow: the progress bar, the deck, the nav row and the keyboard
 * hints, on the pinned shell that never scrolls.
 *
 * Position is the page's own state, seeded from the URL once. Every move
 * reports the new position through `onPositionChange`; nothing here ever
 * routes, so the swipe and the next card are never separated by a navigation.
 *
 * Landing on a question with no entry writes one without a position — that is
 * how this platform records "visited": the intro's "Pokračovat v odpovídání"
 * resumes at the first question with nothing recorded, and a question passed
 * over counts as seen. 2026 only ever wrote on an explicit skip; here the
 * write is on arrival, as the previous question page did it.
 */
export function QuestionPage({ appTitle, electionName, calculatorName, initialPosition, headerActions, attributionHref, logoMonochrome, onPositionChange, onFinish, onBackToGuide }: QuestionPage) {
  const t = useTranslations("koa.components.questionPage");
  const { questions, total } = useQuestions();
  const answers = useAnswersStore((state) => state.answers);
  const getAnswer = useAnswersStore((state) => state.getAnswer);
  const setAnswer = useAnswersStore((state) => state.setAnswer);

  const [index, setIndex] = useState(() => Math.min(Math.max(initialPosition - 1, 0), total - 1));

  /**
   * True right after re-tapping the current answer clears it — a nudge toward
   * "Přeskočit" for the moment the question is unexpectedly unanswered again.
   * Reset on every move, so it never survives to the next card.
   */
  const [justCleared, setJustCleared] = useState(false);

  /**
   * True from the moment the last question's commit hands over to the recap
   * until this screen unmounts. The navigation is asynchronous — an RSC
   * round-trip, or in dev a compile — and without this flag the deck sits
   * fully live in the meantime: its ghost design snaps the same card back after
   * the exit animation, so a slow navigation read as "question 42 can be
   * answered forever", each answer firing another navigation.
   */
  const [leaving, setLeaving] = useState(false);

  /**
   * The card that just landed, spoken.
   *
   * Answering leaves focus on the control that was pressed while the card's
   * content is replaced underneath it, so a reader working by keyboard hears
   * the deck confirm their own answer ("Ano") and is then told nothing
   * whatsoever about the question they have arrived at — the one thing on the
   * screen that changed. Polite, so it queues behind that confirmation and the
   * two read in the order they happened.
   *
   * Empty until the first move: on arrival the question is simply part of the
   * page, and a live region that speaks its own initial contents would read
   * the card out a second time.
   */
  const [landed, setLanded] = useState("");

  /**
   * The "visited" entries this page wrote itself, and the questions explicitly
   * skipped here.
   *
   * Every unanswered question on screen has an entry (see the landing effect
   * below), so "visited without a position" alone cannot tell a question the
   * reader merely looked at from one they passed over — and the nav's filled
   * "Přeskočit" is meant for the latter only: an explicit skip, or an entry an
   * earlier session left behind. 2026 kept a `skipped` flag on the entry
   * itself; this platform's `Answer` has none, so the page remembers instead.
   */
  const [writtenIds, setWrittenIds] = useState<ReadonlySet<string>>(() => new Set());
  const [skippedIds, setSkippedIds] = useState<ReadonlySet<string>>(() => new Set());

  const deckRef = useRef<QuestionDeckHandle>(null);
  const question = questions[index];

  // Landing: record the question as visited the moment it is shown. Idempotent —
  // it may run more than once for the same card (StrictMode, for one).
  useEffect(() => {
    const landedQuestion = questions[index];
    if (!landedQuestion || getAnswer(landedQuestion.id)) return;

    setAnswer({ questionId: landedQuestion.id });
    setWrittenIds((ids) => new Set(ids).add(landedQuestion.id));
  }, [index, questions, getAnswer, setAnswer]);

  /** Everything a move implies: the new card, the nudge reset, the announcement, the URL. */
  const moveTo = useCallback(
    (nextIndex: number) => {
      const target = questions[nextIndex];
      if (!target) return;

      setIndex(nextIndex);
      setJustCleared(false);
      setLanded(t("announce", { position: nextIndex + 1, total, statement: target.statement }));
      onPositionChange(nextIndex + 1);
    },
    [questions, total, t, onPositionChange],
  );

  /**
   * Move on — and off the end of the deck into the recap.
   *
   * The last card advancing to itself would leave someone stuck on question 42
   * with a "Další" that does nothing, so the deck's end is the recap's entrance.
   */
  const advance = useCallback(() => {
    if (leaving) return;
    if (index + 1 >= total) {
      setLeaving(true);
      onFinish();
      return;
    }
    moveTo(index + 1);
  }, [index, leaving, moveTo, onFinish, total]);

  /**
   * Back one card — and, from the first one, back to the tutorial.
   *
   * Question 1 used to carry a dead "Předchozí": the one place in the flow
   * where the control is visible but does nothing, shown to exactly the people
   * least sure of what they are doing. The screen behind question 1 is the
   * návod, so that is where the back control goes, named for the place it
   * returns to like every other back link in the app.
   */
  const goToPrevious = useCallback(() => {
    if (leaving) return;
    if (index === 0) {
      onBackToGuide();
      return;
    }
    moveTo(index - 1);
  }, [index, leaving, moveTo, onBackToGuide]);

  /**
   * Lifts the card away without writing to the answer store — used both by
   * "Další" on an already-answered question and by the browse-only shortcut,
   * which must never record anything even on an unanswered one.
   */
  const advanceAnimated = useCallback(() => {
    deckRef.current?.advance();
    advance();
  }, [advance]);

  const handleAnswer = useCallback(
    (agree: boolean, important: boolean) => {
      if (leaving || !question) return;

      const existing = getAnswer(question.id);
      const isClearing = existing?.answer === agree;

      // Re-choosing the same answer clears it; that is an edit, not progress.
      if (isClearing) {
        setAnswer({ questionId: question.id, answer: undefined });
      } else {
        setAnswer({ questionId: question.id, answer: agree, isImportant: important || existing?.isImportant === true });
        // A position supersedes an earlier skip.
        setSkippedIds((ids) => {
          if (!ids.has(question.id)) return ids;
          const next = new Set(ids);
          next.delete(question.id);
          return next;
        });
      }

      setJustCleared(isClearing);
      if (!isClearing) advance();
    },
    [advance, getAnswer, leaving, question, setAnswer],
  );

  /**
   * Explicitly skip. "Important" only makes sense attached to a real position,
   * so skipping drops any flag armed before the skip rather than carrying it
   * forward unanswered.
   */
  const handleSkip = useCallback(() => {
    if (leaving || !question) return;
    setAnswer({ questionId: question.id, answer: undefined, isImportant: false });
    setSkippedIds((ids) => new Set(ids).add(question.id));
    advance();
  }, [advance, leaving, question, setAnswer]);

  /**
   * Toggle "pro mě důležité". Can be armed before answering: the star pressed
   * first is carried into whichever answer is then given.
   */
  const handleToggleImportant = useCallback(() => {
    if (!question) return;
    setAnswer({ questionId: question.id, isImportant: !getAnswer(question.id)?.isImportant });
  }, [getAnswer, question, setAnswer]);

  /*
   * `,` / `.` browse without touching the answer store — deliberately not
   * modifier keys on the existing arrows. Shift+Arrow already means "extend
   * a text selection" to the browser and some screen readers, which is
   * exactly the wrong association for a shortcut whose entire point is "this
   * one is safe, it changes nothing." Mirrors the nav buttons: `,` is
   * identical to Předchozí, `.` is the store-write-free half of Další.
   */
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // `event.target` is not always an Element (it's `window`/`document` for
      // some synthetically dispatched or unfocused-body keydowns) — guard
      // before calling an Element-only method on it.
      //
      // A key typed into a modal dialog, the shell menu or its trigger is
      // theirs, not the flow's — the help sheet opens over this screen, and
      // a window listener still hears what the top layer is being told.
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable], dialog, [role="menu"], [aria-haspopup="menu"]')) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === ",") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === ".") {
        event.preventDefault();
        advanceAnimated();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goToPrevious, advanceAnimated]);

  if (!question) return null;

  const answer = answers.find((entry) => entry.questionId === question.id);
  const isAnswered = hasAnswer(answer);
  const isSkipped = !isAnswered && (skippedIds.has(question.id) || (isVisited(answer) && !writtenIds.has(question.id)));
  const next = questions[index + 1];
  const after = questions[index + 2];

  return (
    <Shell
      scroll="pinned"
      header={<AppHeader title={appTitle} electionName={electionName} calculatorName={calculatorName} href={attributionHref} logoMonochrome={logoMonochrome} actions={headerActions} />}
    >
      {/* The flow's own landmark. It was the one screen in the app whose
          content sat in a bare `<div>`, so "jump to the main content" — the
          first thing a screen-reader user does on any page — had nowhere to
          land on the forty-two screens they spend the longest on. */}
      <main className={flowClasses}>
        <div className={progressClasses}>
          <ProgressSegments segments={toSegments(questions, answers)} currentIndex={index} label={t("progressLabel")} />
        </div>

        <div className={centerClasses}>
          <div className={stageClasses}>
            <QuestionDeck
              ref={deckRef}
              current={toCardContent(question)}
              next={next ? toCardContent(next) : undefined}
              after={after ? toCardContent(after) : undefined}
              selection={{
                agree: answer?.answer === true,
                disagree: answer?.answer === false,
                important: answer?.isImportant === true,
              }}
              labels={{
                agree: t("agree"),
                disagree: t("disagree"),
                important: t("important"),
                importantSuffix: t("importantSuffix"),
                skip: t("skip"),
              }}
              onAnswer={handleAnswer}
              onSkip={handleSkip}
              onToggleImportant={handleToggleImportant}
              finished={leaving}
            />
          </div>

          <FlowNav
            position={index + 1}
            total={total}
            canGoBack
            onPrevious={goToPrevious}
            onForward={isAnswered ? advanceAnimated : handleSkip}
            previousLabel={index === 0 ? t("guide") : t("previous")}
            forwardLabel={isAnswered ? t("next") : t("skip")}
            isSkipped={isSkipped}
            attention={justCleared}
            counterLabel={t("counter", { position: index + 1, total })}
          />

          {/*
            Left and right get a hint each rather than one shared "odpovědět":
            which arrow means "souhlasím" is the one thing about this shortcut
            a first-time user cannot guess, and the paired row also matches
            the left/right order of the answer buttons on the card.
          */}
          <KeyboardHints
            hints={[
              { keys: [{ icon: icons.arrowLeft, label: t("hints.arrowLeft") }], label: t("agree") },
              { keys: [{ icon: icons.arrowRight, label: t("hints.arrowRight") }], label: t("disagree") },
              { keys: [{ icon: icons.arrowUp, label: t("hints.arrowUp") }], label: t("hints.important") },
              { keys: [{ icon: icons.arrowDown, label: t("hints.arrowDown") }], label: t("skip") },
              {
                keys: [
                  { icon: icons.comma, label: t("hints.comma") },
                  { icon: icons.period, label: t("hints.period") },
                ],
                label: t("hints.browse"),
              },
            ]}
          />

          <VisuallyHidden as="output" aria-live="polite">
            {landed}
          </VisuallyHidden>
        </div>
      </main>
    </Shell>
  );
}
