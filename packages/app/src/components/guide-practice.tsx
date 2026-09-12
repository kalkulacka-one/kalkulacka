"use client";

// Ported from kalkulacka-2026/apps/web/components/guide-practice.tsx (+ .module.css)
import { Button, type CardSelection, type DragDirection, QuestionDeck, type QuestionDeckHandle } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { KeyboardHints } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, useState } from "react";

import { usePointerKind } from "@/client/hooks";

import type { PractisedGesture } from "./guide-steps";

/** The four gestures the card can actually teach; the recap step is a screen. */
const GESTURES: readonly PractisedGesture[] = ["agree", "disagree", "important", "skip"];

/**
 * Which arrows on the card's compass a gesture accounts for.
 *
 * "Important" claims both diagonals: they are the same lift, applied to
 * whichever answer the drag was already heading for, so having done one there
 * is nothing left to discover about the other.
 */
const DIRECTIONS_FOR: Record<PractisedGesture, readonly DragDirection[]> = {
  agree: ["w"],
  disagree: ["e"],
  important: ["nw", "ne"],
  skip: ["s"],
};

const NOTHING_SELECTED: CardSelection = { agree: false, disagree: false, important: false };

const practiceClasses = "koa:flex koa:flex-col koa:gap-3";

/*
 * The deck positions its cards absolutely, so the stage is what gives the card
 * a height. It is capped rather than fluid: this card is a demonstration
 * sitting in a reading column, not the flow's full-viewport stage.
 *
 * A phone (below the design system's `xs`, 34rem — spelled out because the
 * app package has no named breakpoints of its own) gets a shorter card, but
 * not by as much as it once did: 16rem was sized for a card carrying one short
 * headline, and this one carries a two-line instruction with a row of compass
 * pills above and below it.
 */
const stageClasses = "koa:relative koa:w-full koa:h-[clamp(17rem,46vh,21rem)] koa:max-[34rem]:h-72";

/*
 * A nudge, until the card is first used — the keyframe and its timing are the
 * design system's (`--ko-animate-practice-nudge`), hung off `--ko-duration-*`
 * so reduced motion collapses it to nothing without a second rule here.
 */
const nudgingClasses = "koa:animate-(--ko-animate-practice-nudge)";

const underClasses = "koa:flex koa:justify-center";

/*
 * `min-height` reserves the two lines the status can grow to, so the card and
 * the button above it do not jump every time the wording changes length under
 * the reader's own hand.
 */
const statusClasses = "koa:flex koa:flex-col koa:justify-center koa:gap-1 koa:min-h-14 koa:text-center";

/*
 * Plain weight by default — this line changes on every gesture, and bold
 * text that rewrites itself that often reads as a headline, not a caption.
 * Weight (and colour) is reserved for the one moment there is something to
 * actually announce: practice is done.
 */
const lineClasses = "koa:m-0 koa:text-[1.0625rem] koa:font-normal koa:leading-[1.3] koa:text-(--ko-color-text-muted) koa:text-balance";

const lineDoneClasses = "koa:m-0 koa:text-[1.0625rem] koa:font-semibold koa:leading-[1.3] koa:text-(--ko-color-text-strong) koa:text-balance";

const countClasses = "koa:m-0 koa:text-[0.9375rem] koa:text-(--ko-color-text-muted) koa:tabular-nums";

/**
 * The practice card, and the running commentary that teaches from it.
 *
 * The tutorial used to describe the gestures in words and then drop the reader
 * onto question 1 having never made one. This is a real `QuestionDeck` with a
 * throwaway card on it — the identical component the flow uses, so what is
 * learned here is literally the control they meet next, down to the drag
 * physics and the hint toast.
 *
 * There is deliberately no list of steps beside it. On a phone the five-item
 * version pushed the card, the counter and the primary action below the fold
 * between them; the card can teach what it means to swipe left far better than
 * a sentence can, so the sentence became the thing that gave way. The prose
 * still exists as `GuideSteps`, for the help dialog reachable everywhere in
 * the flow, not just here.
 *
 * Nothing it records leaves this component: there is no calculator id and no
 * store write, so a practice swipe cannot show up in the recap.
 */
export function GuidePractice() {
  const t = useTranslations("koa.components.guidePractice");

  const [practised, setPractised] = useState<ReadonlySet<PractisedGesture>>(() => new Set());
  const [selection, setSelection] = useState<CardSelection>(NOTHING_SELECTED);

  /**
   * The gesture just made, which the status line explains. Separate from the
   * practised set because it is about *recency*, not coverage — trying agree a
   * second time should say so again, even though nothing new was learned.
   */
  const [latest, setLatest] = useState<PractisedGesture | null>(null);

  const practise = useCallback((...gestures: PractisedGesture[]) => {
    // The first one named is the one the status line reports: an upward flick
    // that also answers is an answer, with important along for the ride.
    setLatest(gestures[0] ?? null);
    setPractised((current) => {
      if (gestures.every((gesture) => current.has(gesture))) return current;
      const next = new Set(current);
      for (const gesture of gestures) next.add(gesture);
      return next;
    });
  }, []);

  /*
   * The card resets to unanswered after every commit rather than staying
   * selected. There is only ever this one card, so leaving it marked would end
   * the practice after a single swipe — snapping back to neutral is what makes
   * it a card you can keep trying things on.
   */
  const handleAnswer = useCallback(
    (agree: boolean, important: boolean) => {
      if (important) practise(agree ? "agree" : "disagree", "important");
      else practise(agree ? "agree" : "disagree");
      setSelection(NOTHING_SELECTED);
    },
    [practise],
  );

  const handleSkip = useCallback(() => {
    practise("skip");
    setSelection(NOTHING_SELECTED);
  }, [practise]);

  /**
   * The button below the card, which the deck knows nothing about — so the
   * card has to be told to lift away by hand. Without it the only feedback for
   * a tapped "Přeskočit" is a line of text changing under it.
   */
  const deckRef = useRef<QuestionDeckHandle>(null);
  const skipFromButton = useCallback(() => {
    deckRef.current?.advance();
    handleSkip();
  }, [handleSkip]);

  const handleToggleImportant = useCallback(() => {
    practise("important");
    setSelection((current) => ({ ...current, important: !current.important }));
  }, [practise]);

  const complete = GESTURES.every((gesture) => practised.has(gesture));

  /*
   * Finger or mouse, which is the whole difference between the two tutorials
   * this screen can be. A phone is taught the gesture and told to tap; a
   * desktop keeps the gesture — dragging with a mouse works — but is also shown
   * the keyboard row it will have under the real flow, and is told to click.
   */
  const pointer = usePointerKind();

  const practisedDirections = useMemo(() => {
    const directions = new Set<DragDirection>();
    for (const gesture of practised) {
      for (const direction of DIRECTIONS_FOR[gesture]) directions.add(direction);
    }
    return directions;
  }, [practised]);

  /** What each gesture means, said at the moment it is made. */
  const feedback: Record<PractisedGesture, string> = {
    agree: t("feedbackAgree"),
    disagree: t("feedbackDisagree"),
    important: t("feedbackImportant"),
    skip: t("feedbackSkip"),
  };

  return (
    <div className={practiceClasses}>
      <div className={latest === null ? `${stageClasses} ${nudgingClasses}` : stageClasses}>
        <QuestionDeck
          ref={deckRef}
          /*
            No statement, no chips: there is nothing here to agree or disagree
            with, and a headline saying so ("Vyzkoušejte si gesta.") only
            repeated what the screen's own description already says. Dropping
            "Cvičná otázka" / "Nanečisto" too — a real question's chips carry
            information (topic, difficulty); this card's only ever said "this
            is practice" twice, once in the screen title above it, and cost the
            card a whole row to do it. The card's one line is the instruction
            for using it, now the only text on the card.
          */
          current={{ id: "practice", detail: pointer === "mouse" ? t("bodyPointer") : t("bodyTouch") }}
          selection={selection}
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
          dragGuides={{ practised: practisedDirections, split: pointer === "mouse" }}
        />
      </div>

      {/*
        The flow reaches "Přeskočit" from `FlowNav`, which this screen has no
        room for — leaving the downward drag as the only way to try the fourth
        gesture, and so leaving it out of reach of anyone working with taps
        alone. The recap's question dialog puts the same control in the same
        place for the same reason.
      */}
      <div className={underClasses}>
        <Button variant="plate" size="small" iconStart={icons.arrowDown} onClick={skipFromButton}>
          {t("skip")}
        </Button>
      </div>

      {/*
        This is the teaching surface now that the step list is gone: it names
        the gesture just made *and* what it does, at the moment the reader's
        own hand made it. `aria-live` rather than a heading — the text changes
        under them, so it is a status, not new content.

        Nothing to say before the first gesture: the "how to drag this" line
        that used to sit here now lives on the card itself, where the hand
        already is, and repeating it under the card would be the same sentence
        twice on one screen.

        The feedback line does not retire once practice is complete — it stays
        and "Máte to v ruce" joins it as a second line rather than replacing
        it. The last thing the reader's hand did is still the most recent fact
        on the screen; losing it the instant the count hits four would make the
        one gesture that happened to finish the set the one gesture the status
        line stays silent about.
      */}
      <div className={statusClasses} aria-live="polite">
        {latest !== null ? <p className={lineClasses}>{feedback[latest]}</p> : null}

        {complete ? <p className={lineDoneClasses}>{t("done")}</p> : <p className={countClasses}>{t("progress", { done: practised.size, total: GESTURES.length })}</p>}
      </div>

      {/*
        The same shortcut row the flow carries, on the screen that is meant to
        teach it — a desktop reader who learns the arrows here never has to
        discover them mid-questionnaire. Touch gets nothing: there is no
        keyboard to press, and the gestures are what the arrows on the card and
        the line above are already teaching.
      */}
      {pointer === "mouse" ? (
        <KeyboardHints
          hints={[
            { keys: [{ icon: icons.arrowLeft, label: t("hints.arrowLeft") }], label: t("agree") },
            { keys: [{ icon: icons.arrowRight, label: t("hints.arrowRight") }], label: t("disagree") },
            { keys: [{ icon: icons.arrowUp, label: t("hints.arrowUp") }], label: t("hints.important") },
            { keys: [{ icon: icons.arrowDown, label: t("hints.arrowDown") }], label: t("skip") },
          ]}
        />
      ) : null}
    </div>
  );
}
