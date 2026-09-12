"use client";

// Ported from kalkulacka-2026/packages/ui/src/question-deck/question-deck.tsx and question-deck.module.css
import { type Ref, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

import { VisuallyHidden } from "../../server/visuallyHidden";
import { type DragDirection, DragGuides } from "../dragGuides";
import { type CardSelection, QuestionCard, type QuestionCardContent } from "../questionCard";
import { advanceTransform, answerSwitchHold, type CommitSpeed, exitTransform, type SwipeZone, speedFor } from "./swipePhysics";
import { type SwipeIntent, useSwipeDeck } from "./useSwipeDeck";

export type QuestionDeckLabels = {
  agree: string;
  disagree: string;
  important: string;
  skip: string;
  /** Appended to the hint when the swipe also marks the question important. */
  importantSuffix: string;
};

export type QuestionDeckProps = {
  /** The question being answered. */
  current: QuestionCardContent;
  /** Peeking out behind it, if there is one. */
  next?: QuestionCardContent;
  /** Third in the stack. Only its silhouette is visible. */
  after?: QuestionCardContent;
  selection: CardSelection;
  labels: QuestionDeckLabels;
  /** `important` reflects the star at the moment of answering. */
  onAnswer: (agree: boolean, important: boolean) => void;
  onSkip: () => void;
  onToggleImportant: () => void;
  /**
   * Draw the direction compass over the card. The tutorial's practice deck
   * passes it; the flow does not, where the arrows would be permanent furniture
   * over every one of forty questions.
   */
  dragGuides?: { practised?: ReadonlySet<DragDirection>; split?: boolean };
  /**
   * The last card has been committed and the screen is leaving. The ghost
   * still flies, but no live card snaps back behind it and further input is
   * ignored — without this, the deck's decoupled-ghost design re-offers the
   * same question for as long as the navigation away takes, and a slow
   * network reads as "I can answer the last question forever."
   */
  finished?: boolean;
  ref?: Ref<QuestionDeckHandle>;
};

export type QuestionDeckHandle = {
  /**
   * Play the "moving on" animation for a question that is already answered.
   *
   * Driven from outside because the control that triggers it — "Další" — lives
   * in the navigation bar below the deck, not on the card.
   */
  advance: () => void;
};

type Ghost = {
  content: QuestionCardContent;
  selection: CardSelection;
  from: string;
  to: string;
  speed: CommitSpeed;
};

const AT_REST = "translate(0px, 0px) rotate(0deg)";

/**
 * The swipeable card stack.
 *
 * The card that leaves is not the card the user was touching: on commit we
 * clone it into a "ghost" layer that flies out on its own, and immediately snap
 * the real card back to centre showing the next question. That decoupling is
 * what keeps the next question interactive during the exit animation.
 *
 * The moment-to-moment transforms are inline styles written by `useSwipeDeck`;
 * only the static arrangement of the layers lives in `styles.css` (`.ko-deck*`).
 */
export function QuestionDeck({ current, next, after, selection, labels, onAnswer, onSkip, onToggleImportant, dragGuides, finished = false, ref }: QuestionDeckProps) {
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [hint, setHint] = useState<SwipeIntent | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * The answer a card is switching to, held on screen for `ANSWER_SWITCH_HOLD`
   * before the card leaves on it — see that constant for why.
   *
   * Non-null only during that beat, and it is what the card renders while it
   * lasts: the store still holds the *old* answer until `commit` runs, so
   * without this the card would sit through the pause still showing the answer
   * being replaced.
   */
  const [switching, setSwitching] = useState<SwipeIntent | null>(null);
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commit = useCallback(
    (intent: SwipeIntent, speed: CommitSpeed, from: string) => {
      if (finished) return;
      const { zone, important } = intent;

      setGhost({
        content: current,
        selection: {
          agree: zone === "agree",
          disagree: zone === "disagree",
          important: zone === "skip" ? selection.important : important,
        },
        from,
        to: exitTransform(zone, important),
        speed,
      });

      // Screen readers get told what was recorded; the swipe itself is silent.
      setAnnouncement(zone === "skip" ? labels.skip : `${zone === "agree" ? labels.agree : labels.disagree}${important ? labels.importantSuffix : ""}`);

      if (zone === "skip") onSkip();
      else onAnswer(zone === "agree", important);
    },
    [current, finished, selection.important, labels, onAnswer, onSkip],
  );

  const { cardRef, nextRef, backRef, onPointerDown, isDragging, animateStackRise } = useSwipeDeck({
    onCommit: (swipeIntent, from) => commit(swipeIntent, "normal", from),
    onIntentChange: setHint,
    // Not draggable through the hold: the card is showing an answer it is
    // about to leave on, and a drag would be answering it a second time.
    disabled: switching !== null,
  });

  /** Tapping a button commits from rest, so it flies out a little slower. */
  const commitFromButton = useCallback(
    (zone: SwipeZone, important: boolean) => {
      setSwitching(null);
      commit({ zone, important }, "slow", AT_REST);
      animateStackRise("slow");
    },
    [commit, animateStackRise],
  );

  /**
   * Answer from a button or the keyboard.
   *
   * `replacing` an answer that is already there splits this into two visible
   * steps — the selection moves to the pressed button, then the card leaves on
   * it. A first answer stays a single step.
   */
  const answerFromButton = useCallback(
    (zone: SwipeZone, important: boolean, replacing: boolean) => {
      if (!replacing) {
        commitFromButton(zone, important);
        return;
      }

      setSwitching({ zone, important });
      switchTimer.current = setTimeout(() => commitFromButton(zone, important), answerSwitchHold() * 1000);
    },
    [commitFromButton],
  );

  const handleAgree = useCallback(() => {
    // Presses during the hold are the same press arriving twice — the card is
    // already committed to leaving on this answer.
    if (switching) return;
    if (selection.agree) {
      // Choosing the same answer again clears it, without leaving the card.
      onAnswer(true, selection.important);
      return;
    }
    answerFromButton("agree", selection.important, selection.disagree);
  }, [answerFromButton, onAnswer, selection.agree, selection.disagree, selection.important, switching]);

  const handleDisagree = useCallback(() => {
    if (switching) return;
    if (selection.disagree) {
      onAnswer(false, selection.important);
      return;
    }
    answerFromButton("disagree", selection.important, selection.agree);
  }, [answerFromButton, onAnswer, selection.agree, selection.disagree, selection.important, switching]);

  const handleSkip = useCallback(() => {
    if (switching) return;
    commit({ zone: "skip", important: false }, "normal", AT_REST);
    animateStackRise("normal");
  }, [commit, animateStackRise, switching]);

  useImperativeHandle(
    ref,
    () => ({
      advance: () => {
        if (finished) return;
        // No fling: the answer is not changing, so the card just lifts away.
        setGhost({
          content: current,
          selection,
          from: AT_REST,
          to: advanceTransform(),
          speed: "instant",
        });
        animateStackRise("instant");
      },
    }),
    [current, finished, selection, animateStackRise],
  );

  // Drive the ghost's flight once React has painted it at its starting point.
  useLayoutEffect(() => {
    if (!ghost) return;
    const el = ghostRef.current;
    if (!el) return;

    // Reduced motion collapses both to near-zero: the answered card is simply
    // gone rather than thrown off the side of the screen, which is the single
    // largest movement in the app and the one this preference exists for.
    const { fly, fade } = speedFor(ghost.speed);

    el.style.transition = "none";
    el.style.transform = ghost.from;
    el.style.opacity = "1";

    // Force a reflow so the browser treats the next assignment as a change to
    // animate rather than folding both into one paint.
    void el.offsetWidth;

    el.style.transition = `transform ${fly}s var(--ko-ease-exit), opacity ${fade}s ease-in`;
    el.style.transform = ghost.to;
    el.style.opacity = "0";

    if (ghostTimer.current) clearTimeout(ghostTimer.current);
    ghostTimer.current = setTimeout(() => setGhost(null), fly * 1000 + 60);
  }, [ghost]);

  useEffect(
    () => () => {
      if (ghostTimer.current) clearTimeout(ghostTimer.current);
      if (switchTimer.current) clearTimeout(switchTimer.current);
    },
    [],
  );

  // Keyboard mirrors the gestures: left/right answer, down skips, up marks
  // important — the same directions the swipes use.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // `event.target` is not always an Element (it's `window`/`document` for
      // some synthetically dispatched or unfocused-body keydowns) — guard
      // before calling an Element-only method on it.
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable]")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handleAgree();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleDisagree();
          break;
        case "ArrowDown":
          event.preventDefault();
          handleSkip();
          break;
        case "ArrowUp":
          event.preventDefault();
          onToggleImportant();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleAgree, handleDisagree, handleSkip, onToggleImportant]);

  const cardLabels = {
    agree: labels.agree,
    disagree: labels.disagree,
    important: labels.important,
  };

  const showHint = isDragging && hint !== null;

  /*
   * While dragging, the active card previews the answer it would record —
   * matching the prototype, where the buttons themselves light up under the
   * drag rather than only the hint pill saying so. Below the zone-activation
   * threshold `hint` is null and the preview briefly clears, exactly as it
   * does in the prototype, until the drag re-crosses into a zone. "Important"
   * is the one thing that does not clear: it is an OR with the stored value so
   * a question armed by an earlier star tap stays visibly armed through a
   * drag that does not itself reach the up-swipe threshold.
   */
  const activeSelection: CardSelection = switching
    ? {
        // The beat before the card leaves: it shows the answer it is leaving
        // on, which the store does not hold yet.
        agree: switching.zone === "agree",
        disagree: switching.zone === "disagree",
        important: switching.important || selection.important,
      }
    : isDragging
      ? {
          agree: hint?.zone === "agree",
          disagree: hint?.zone === "disagree",
          important: (hint !== null && hint.zone !== "skip" && hint.important) || selection.important,
        }
      : selection;

  return (
    <div className="ko-deck">
      {after ? (
        <div ref={backRef} className="ko-deck-layer ko-deck-back">
          {/* An empty card, so the stack still reads as a deck on the last question. */}
          <div className="ko:absolute ko:inset-0 ko:bg-surface ko:rounded-card ko:border ko:border-border ko:shadow-card-back" />
        </div>
      ) : null}

      {next ? (
        <div ref={nextRef} className="ko-deck-layer ko-deck-next">
          <QuestionCard content={next} selection={{ agree: false, disagree: false, important: false }} labels={cardLabels} elevation="next" inert />
        </div>
      ) : null}

      {finished ? null : (
        <QuestionCard
          ref={cardRef}
          className="ko-deck-active"
          content={current}
          selection={activeSelection}
          labels={cardLabels}
          /* The one card on the deck that is being read, so its statement is the
             screen's heading. The layers behind it and the ghost in front are
             `inert` and out of the accessibility tree entirely, so this never
             puts a second `<h1>` in front of anyone. */
          statementAs="h1"
          onPointerDown={onPointerDown}
          onAgree={handleAgree}
          onDisagree={handleDisagree}
          onToggleImportant={onToggleImportant}
          guides={dragGuides ? <DragGuides labels={labels} split={dragGuides.split} practised={dragGuides.practised} active={showHint ? directionForIntent(hint) : null} /> : undefined}
        />
      )}

      {ghost ? <QuestionCard ref={ghostRef} className="ko-deck-ghost" content={ghost.content} selection={ghost.selection} labels={cardLabels} elevation="lifted" inert /> : null}

      <div className={showHint ? "ko-deck-toast ko-deck-toast-visible" : "ko-deck-toast"} aria-hidden="true">
        {hint ? <HintLabel intent={hint} labels={labels} /> : null}
      </div>

      {/* Announces the committed answer without moving focus. */}
      <VisuallyHidden as="output" aria-live="polite">
        {announcement}
      </VisuallyHidden>
    </div>
  );
}

/**
 * Which arrow the drag is currently pointing at.
 *
 * Read from the same intent the hint toast uses, so the compass and the toast
 * can never disagree about what releasing right now would do.
 */
function directionForIntent(intent: SwipeIntent | null): DragDirection | null {
  if (!intent) return null;
  if (intent.zone === "skip") return "s";
  if (intent.zone === "agree") return intent.important ? "nw" : "w";
  return intent.important ? "ne" : "e";
}

/**
 * What releasing right now would record.
 *
 * Whatever the card's own buttons say, and nothing else. An answer has exactly
 * one name in this app — the `agree`/`disagree` labels — and the toast is the
 * one place that name used to be rewritten, first shrinking to a compact form
 * on a narrow deck and later spelling out a longer synonym. A control that
 * renames the answer at the moment of committing is teaching the reader a
 * second word for the thing they just chose.
 */
function HintLabel({ intent, labels }: { intent: SwipeIntent; labels: QuestionDeckLabels }) {
  if (intent.zone === "skip") return <span>{labels.skip}</span>;

  const answer = intent.zone === "agree" ? labels.agree : labels.disagree;

  return (
    <span>
      {answer}
      {intent.important ? labels.importantSuffix : ""}
    </span>
  );
}
