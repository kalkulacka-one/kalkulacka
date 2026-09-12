"use client";

// Ported from kalkulacka-2026/packages/ui/src/question-dialog/question-dialog.tsx and question-dialog.module.css
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button } from "./button";
import { type CardSelection, QuestionCard, type QuestionCardContent } from "./questionCard";
import { answerSwitchHold, type CommitSpeed, exitTransform, type SwipeZone, speedFor } from "./questionDeck/swipePhysics";
import { type SwipeIntent, useSwipeDeck } from "./questionDeck/useSwipeDeck";

export type QuestionDialogLabels = {
  agree: string;
  disagree: string;
  important: string;
  skip: string;
  close: string;
};

export type QuestionDialogProps = {
  /** `undefined` closes it. The content stays mounted for the fade-out. */
  question?: QuestionCardContent;
  selection: CardSelection;
  labels: QuestionDialogLabels;
  onClose: () => void;
  /**
   * An answer was taken and the card is flying out on it — the owner records
   * it and clears `question`, and the dialog closes behind the flight. The one
   * exception is re-choosing the answer the card already shows: that clears
   * it, nothing flies, and the owner keeps `question` so the dialog stays open
   * on the now-unanswered card.
   */
  onAnswer: (agree: boolean) => void;
  /** The card is flying down; the owner records the skip and clears `question`. */
  onSkip: () => void;
  onToggleImportant: () => void;
};

/** What was open, kept around through the close animation after the prop clears it. */
type Snapshot = {
  question: QuestionCardContent;
  selection: CardSelection;
  labels: QuestionDialogLabels;
};

/**
 * A card on its way out of the dialog, in the direction of the answer that sent
 * it — left for "Ano", right for "Ne", down for a skip.
 *
 * The deck flies a *ghost* because it has a live card underneath that has to
 * stay interactive; here the card is the only one there is and the dialog is
 * closing behind it, so the card itself flies. Same transforms, same speeds
 * (`swipePhysics`), so an answer changed from the recap leaves exactly the way
 * the same answer leaves on the deck — which it did not before: it faded
 * straight down, and the direction that means "this is what you chose" was the
 * one thing the recap never showed.
 */
type Flight = { from: string; to: string; speed: CommitSpeed };

const AT_REST = "translate(0px, 0px) rotate(0deg)";

/*
 * The element is the full-viewport click-catcher; the card inside it is what
 * you see. No panel of its own — see the component's doc comment. The same
 * flattening of the UA's box as `Dialog`, but inset by the flow's own gutter
 * rather than a fixed amount, so the card sits where the deck's would. The
 * `ko-question-dialog` hook is for the veil (`::backdrop`) in `styles.css`.
 */
const dialogClasses =
  "ko-question-dialog ko:w-full ko:h-full ko:max-w-none ko:max-h-none ko:m-0 ko:p-fluid-gutter ko:border-0 ko:bg-transparent ko:overflow-hidden ko:open:flex ko:items-center ko:justify-center";

/*
 * Past the card's own 37.5rem container query, so the answer buttons carry
 * their labels here exactly as they do in the deck. A narrower dialog would
 * silently downgrade them to bare icons — the same card, quietly saying less.
 *
 * The height matches the deck's own stage cap (the flow's 33.75rem) plus the
 * row underneath, so the card opens at the size it had when it was answered
 * rather than stretching to whatever the window allows.
 */
const shellClasses = "ko:flex ko:flex-col ko:gap-3 ko:w-full ko:max-w-[42rem] ko:h-full ko:max-h-[37rem]";

/*
 * The shell's entrance and — for a dismissal only — its exit, as the theme
 * animations `--ko-animate-question-dialog-*`. One or the other, never both:
 * the two are switched rather than merged, so there is no question of which
 * `animation` wins.
 */
const enteringClasses = "ko:animate-question-dialog-in";
const leavingClasses = "ko:animate-question-dialog-out";

/*
 * The card is `position: absolute; inset: 0`, so the stage owns its size. A
 * container as well, which is what parks the drag hint over the bottom of the
 * card rather than at the foot of the screen — see `.ko-deck-toast`.
 */
const stageClasses = "ko:relative ko:flex-1 ko:min-h-0 ko:@container";

const underClasses = "ko:flex ko:flex-none ko:items-center ko:justify-center";

/**
 * The full question, opened from a recap row.
 *
 * Deliberately the *same* `QuestionCard` the deck renders rather than a
 * dialog-shaped restatement of it — the recap's rows are a summary, and the
 * thing they summarise has to look like what it looked like when it was
 * answered. So this modal has no panel of its own: the card is the panel,
 * with a classic corner close on it (the one thing the deck's cards never
 * need), and a skip control that appears under it only when there is
 * something to skip — see `attentionSkip` below.
 *
 * Built on the platform's `<dialog>` for the same reasons `Dialog` is — focus
 * trapping, Escape, inertness and the top layer are the browser's job.
 */
export function QuestionDialog({ question, selection, labels, onClose, onAnswer, onSkip, onToggleImportant }: QuestionDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  // Kept alive past `question` going undefined so the card has something to
  // fade out with instead of vanishing the instant the parent clears it.
  const [snapshot, setSnapshot] = useState<Snapshot | undefined>();
  const [closing, setClosing] = useState(false);

  /** Set the moment an answer is taken; cleared when the card has landed. */
  const [flight, setFlight] = useState<Flight | null>(null);
  /**
   * The answer the card is leaving on.
   *
   * Held separately from `snapshot.selection` for two overlapping reasons: it
   * is what the card shows through the switch hold, before the store knows
   * about it, and it is what the card keeps showing through the flight, after
   * the parent has cleared `question` and frozen the snapshot on the *old*
   * answer. Either way the card that flies is visibly the answer just chosen.
   */
  const [taken, setTaken] = useState<SwipeIntent | null>(null);
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (question) setSnapshot({ question, selection, labels });
  }, [question, selection, labels]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `snapshot` deliberately excluded — this only reacts to `question` arriving or leaving, not to the snapshot the other effect just wrote.
  useEffect(() => {
    if (question) {
      setClosing(false);
      return;
    }
    if (snapshot) setClosing(true);
  }, [question]);

  /*
   * A dismissal during the switch hold cancels the answer outright. Escape, the
   * corner close and a click on the veil all clear `question` upstream, and
   * without this the held answer would still land a fraction of a second later
   * — recording the very edit that was just backed out of.
   */
  useEffect(() => {
    if (question) return;
    if (switchTimer.current) {
      clearTimeout(switchTimer.current);
      switchTimer.current = null;
      setTaken(null);
    }
  }, [question]);

  const finish = useCallback(() => {
    setSnapshot(undefined);
    setClosing(false);
    setFlight(null);
    setTaken(null);
  }, []);

  // The animation, not a timer, decides when the fade-out is actually done —
  // so `prefers-reduced-motion`'s near-zero duration still resolves promptly
  // instead of the dialog sitting invisible-but-mounted for a fixed delay.
  useEffect(() => {
    if (!closing) return;

    // A card that is flying is animating with an inline transition rather than
    // the shell's keyframes, so there is no `animationend` on the shell to wait
    // for — the flight's own duration is what says when it has landed. Same
    // arithmetic the deck uses to retire its ghost, including the slack.
    if (flight) {
      const { fly } = speedFor(flight.speed);
      const timer = setTimeout(finish, fly * 1000 + 60);
      return () => clearTimeout(timer);
    }

    const shell = shellRef.current;
    if (!shell) {
      finish();
      return;
    }
    shell.addEventListener("animationend", finish, { once: true });
    return () => shell.removeEventListener("animationend", finish);
  }, [closing, flight, finish]);

  useEffect(
    () => () => {
      if (switchTimer.current) clearTimeout(switchTimer.current);
    },
    [],
  );

  /**
   * Re-tapping the current answer clears it — an edit that leaves the question
   * unanswered right as someone is looking at it, so "Přeskočit" gets a nudge
   * toward it. Reset whenever a different question opens, so the highlight
   * never survives to the next card.
   */
  const [attentionSkip, setAttentionSkip] = useState(false);
  const prevSelectionRef = useRef(selection);

  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on `question?.id` alone — this resets on a *different* question opening, not on every selection change.
  useEffect(() => {
    prevSelectionRef.current = selection;
    setAttentionSkip(false);
  }, [question?.id]);

  useEffect(() => {
    const prev = prevSelectionRef.current;
    const hadAnswer = prev.agree || prev.disagree;
    const hasAnswer = selection.agree || selection.disagree;
    if (hadAnswer && !hasAnswer) setAttentionSkip(true);
    else if (hasAnswer) setAttentionSkip(false);
    prevSelectionRef.current = selection;
  }, [selection]);

  /**
   * The same drag a question in the deck gets — left/right answers, down
   * skips, an upward flick arms "pro mě důležité". `useSwipeDeck` is written
   * for a three-card stack, but its `next`/`back` refs are simply never
   * attached here: every write to them is already guarded internally, so a
   * single-card modal is just the stack with two of its layers absent.
   *
   * On a successful drag the hook itself snaps the real card back to centre
   * right after `onCommit` runs — there is no "next card" underneath to
   * reveal here — so `flight` picks the card straight back up at the position
   * it was released from and carries it the rest of the way out.
   */
  const handleCommit = useCallback(
    (commitIntent: SwipeIntent, from: string) => {
      const { zone, important } = commitIntent;

      setTaken(commitIntent);
      setFlight({ from, to: exitTransform(zone, important), speed: "normal" });

      if (zone === "skip") {
        onSkip();
        return;
      }
      if (important && !selection.important) onToggleImportant();
      onAnswer(zone === "agree");
    },
    [onAnswer, onSkip, onToggleImportant, selection.important],
  );

  const { cardRef, onPointerDown, isDragging, intent } = useSwipeDeck({
    onCommit: handleCommit,
    disabled: closing || flight !== null || taken !== null,
  });

  /**
   * Fly the card, once React has painted it at its starting point.
   *
   * The reflow in the middle is what makes the browser treat the second
   * assignment as something to animate rather than folding both into one paint
   * — the same dance the deck does with its ghost. It matters twice on the drag
   * path, where the hook has already snapped the card back to centre and the
   * release position has to be put back before it can be animated away from.
   */
  useLayoutEffect(() => {
    if (!flight) return;
    const card = cardRef.current;
    if (!card) return;

    const { fly, fade } = speedFor(flight.speed);

    card.style.transition = "none";
    card.style.transform = flight.from;
    card.style.opacity = "1";

    void card.offsetWidth;

    card.style.transition = `transform ${fly}s var(--ko-ease-exit), opacity ${fade}s ease-in`;
    card.style.transform = flight.to;
    card.style.opacity = "0";
  }, [flight, cardRef]);

  /**
   * Answer from a button or the keyboard.
   *
   * Same two-step rule the deck follows: replacing an answer that is already
   * there holds the card on the new selection for a beat before it leaves, so
   * the change and its consequence are two things you can see rather than one
   * you can't. Committing from rest flies a little slower than a flick does —
   * there is no momentum to inherit.
   */
  const commitFromButton = useCallback(
    (zone: SwipeZone, important: boolean, replacing: boolean) => {
      const fly = () => {
        // Nulled as it fires: the cancel-on-dismiss effect above reads this ref
        // to tell "an answer is still being held" from "one is already away".
        switchTimer.current = null;
        setFlight({ from: AT_REST, to: exitTransform(zone, important), speed: "slow" });
        if (zone === "skip") onSkip();
        else onAnswer(zone === "agree");
      };

      setTaken({ zone, important });
      if (!replacing) {
        fly();
        return;
      }
      switchTimer.current = setTimeout(fly, answerSwitchHold() * 1000);
    },
    [onAnswer, onSkip],
  );

  /**
   * One route for every answer the card's own controls can produce, so the
   * clear-by-repeating rule and the two-step rule are stated once.
   *
   * Re-choosing the current answer clears it and the dialog stays open, so
   * that path takes no flight — nothing is leaving.
   */
  const answer = useCallback(
    (agree: boolean) => {
      if (taken) return;
      const current = snapshot?.selection ?? selection;
      if (agree ? current.agree : current.disagree) {
        onAnswer(agree);
        return;
      }
      commitFromButton(agree ? "agree" : "disagree", current.important, agree ? current.disagree : current.agree);
    },
    [commitFromButton, onAnswer, selection, snapshot?.selection, taken],
  );

  const skip = useCallback(() => {
    if (taken) return;
    commitFromButton("skip", false, false);
  }, [commitFromButton, taken]);

  /**
   * What the card's own controls read as, which is not always what the store
   * says: through the switch hold the store has not been told yet, and through
   * the flight the snapshot is frozen on the answer being replaced. A skip
   * takes no answer with it, so it leaves the card showing exactly what it was.
   */
  const shownSelection: CardSelection =
    taken && taken.zone !== "skip" && snapshot
      ? {
          agree: taken.zone === "agree",
          disagree: taken.zone === "disagree",
          important: taken.important || snapshot.selection.important,
        }
      : (snapshot?.selection ?? selection);

  const visible = snapshot !== undefined;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (visible && !dialog.open) dialog.showModal();
    if (!visible && dialog.open) dialog.close();
  }, [visible]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    // Anything that closes the element without going through `onClose` — a
    // browser-initiated dismissal, say — still has to reach the owner, or the
    // state would say open while the element is shut and it could never
    // reopen. Unless the element is open again by the time its (queued) `close`
    // event lands: then the closing it reports has already been undone by a
    // reopen, and passing it on would close the new question — see `Dialog`.
    const handleClose = () => {
      if (dialog.open) return;
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={dialogClasses}
      data-closing={closing || undefined}
      aria-label={snapshot?.question.title ?? snapshot?.question.statement}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      /*
       * Escape is routed through React rather than left to the element, so
       * that every dismissal takes the same path through the owner's state
       * (see `dialog.tsx` for the failure this avoids). The arrow keys mirror
       * the deck's own shortcuts (`questionDeck.tsx`) — left/right answer,
       * down skips, up arms "pro mě důležité" — scoped to this element rather
       * than a window listener because native focus-trapping already means
       * they only reach here while the dialog is actually open.
       */
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
          return;
        }
        if (!snapshot || event.metaKey || event.ctrlKey || event.altKey) return;

        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            answer(true);
            break;
          case "ArrowRight":
            event.preventDefault();
            answer(false);
            break;
          case "ArrowDown":
            event.preventDefault();
            skip();
            break;
          case "ArrowUp":
            event.preventDefault();
            if (!taken) onToggleImportant();
            break;
          default:
            break;
        }
      }}
    >
      {snapshot ? (
        /*
          The shell's own fade-out is for dismissals — close, Escape, a click on
          the veil. An answered card is flying instead, and fading the shell out
          from under it would take the flight with it.
        */
        <div ref={shellRef} className={`${shellClasses} ${closing && !flight ? leavingClasses : enteringClasses}`}>
          <div className={stageClasses}>
            <QuestionCard
              ref={cardRef}
              content={snapshot.question}
              selection={shownSelection}
              labels={snapshot.labels}
              /* Second level, not first: this opens over the recap, whose own
                 `<h1>` names the screen the reader is still on. */
              statementAs="h2"
              elevation="lifted"
              close={{ label: snapshot.labels.close, onClose }}
              onPointerDown={onPointerDown}
              onAgree={() => answer(true)}
              onDisagree={() => answer(false)}
              onToggleImportant={taken ? undefined : onToggleImportant}
            />

            {/* The deck's own drag hint — what releasing now would do. */}
            <div className={isDragging && intent ? "ko-deck-toast ko-deck-toast-visible" : "ko-deck-toast"} aria-hidden="true">
              {intent ? <span>{hintFor(intent, snapshot.labels)}</span> : null}
            </div>
          </div>

          {/*
            Only appears right after re-tapping the current answer clears it —
            the one moment "Přeskočit" is actually the next move rather than
            just another way to leave. Opening an already-open question (one
            that's still unanswered from before) offers no skip button at all:
            there is nothing new here to skip.
          */}
          {attentionSkip ? (
            <div className={underClasses}>
              {/* The same filled neutral `FlowNav`'s skip control wears once a question was explicitly skipped: always drawn as the obvious next move. */}
              <Button variant="solid" color="neutral" size="small" onClick={skip}>
                {snapshot.labels.skip}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}

/** What releasing right now would record — the answer's own name, nothing else (see the deck's `HintLabel`). */
function hintFor(intent: SwipeIntent, labels: QuestionDialogLabels): string {
  if (intent.zone === "skip") return labels.skip;
  return intent.zone === "agree" ? labels.agree : labels.disagree;
}
