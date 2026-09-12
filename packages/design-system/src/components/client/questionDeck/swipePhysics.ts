// Ported verbatim from kalkulacka-2026/packages/ui/src/question-deck/swipe-physics.ts

/**
 * Gesture constants, measured from the prototype.
 *
 * These are the feel of the product, so they live together and named rather
 * than scattered as literals. They are not theme tokens: a partner re-skinning
 * the app should not be able to accidentally change how a swipe behaves.
 */

import { prefersReducedMotion } from "../../../utilities/prefersReducedMotion";

export type SwipeZone = "agree" | "disagree" | "skip";

/** Where the stacked cards sit when the top card is at rest. */
export const STACK_NEXT = {
  x: 12,
  y: -22,
  scale: 0.95,
  rotate: 0.5,
  brightness: 0.99,
  opacity: 1,
} as const;

export const STACK_BACK = {
  x: 24,
  y: -40,
  scale: 0.9,
  rotate: 1,
  brightness: 0.98,
  opacity: 1,
} as const;

/** How far the stack cards travel toward the front as the top card is dragged. */
export const STACK_TRAVEL = {
  next: { x: -16, y: 18, scale: 0.05, rotate: -0.8, brightness: 0.08, opacity: 0 },
  back: { x: -16, y: 16, scale: 0.06, rotate: -0.7, brightness: 0.1, opacity: 0 },
} as const;

export const PHYSICS = {
  /** Drag distance that commits an answer. */
  threshold: 50,
  /** Horizontal drag is divided by this to produce the card's tilt in degrees. */
  rotationDivisor: 18,
  /** Drag distance at which the stack has fully caught up. */
  stackProgressDistance: 130,
  /** Horizontal travel before a left/right intent is recognised. */
  zoneActivateX: 25,
  /** Upward travel that arms "pro mě důležité" mid-swipe. */
  importantLiftY: -38,
  /** Downward travel before a skip is recognised... */
  skipActivateY: 45,
  /** ...and how much it must dominate horizontal travel to count as one. */
  skipDominance: 1.2,
} as const;

/** Where a committed card flies to. */
export const EXIT = {
  horizontalX: 480,
  /** An important answer flicks up and away; an ordinary one drops slightly. */
  liftImportant: -300,
  liftNormal: 60,
  rotation: 24,
  skipY: 560,
  skipRotation: 2,
  /** Advancing without recording an answer — a small lift, no fling. */
  advanceY: -34,
  advanceScale: 0.94,
} as const;

export type CommitSpeed = "normal" | "slow" | "instant";

/**
 * Committing by tap animates slower than committing by flick: the card has no
 * momentum to inherit, so matching the drag timing reads as abrupt.
 */
export const SPEEDS: Record<CommitSpeed, { fly: number; fade: number }> = {
  normal: { fly: 0.38, fade: 0.16 },
  slow: { fly: 0.44, fade: 0.2 },
  instant: { fly: 0.12, fade: 0.1 },
};

export const SPRING_BACK_DURATION = 0.36;

/**
 * How long a card holds on a freshly-changed answer before it leaves.
 *
 * Only ever applies to *changing* an answer that already exists — pressing "Ne"
 * on a card that currently reads "Ano". Committing and flying in the same frame
 * makes those two presses look identical from the outside: the card is gone
 * before the button it was pressed on has visibly changed, so the one thing the
 * reader wanted confirmed — that the new answer took — is the one thing they
 * never see. The beat is the confirmation; the flight is the consequence.
 *
 * A first answer does not get it. There is nothing to correct, the button's own
 * press state already reads, and paying a quarter of a second on every one of
 * forty cards to say what was never in doubt is a tax, not a reassurance.
 */
export const ANSWER_SWITCH_HOLD = 0.26;

/**
 * What every duration here collapses to under `prefers-reduced-motion`.
 *
 * Near-zero rather than zero, matching what `styles.css` does to the duration
 * tokens: a transition of `0s` is not a transition at all and fires no
 * `transitionend`, and the deck's own timers are sized against these numbers.
 */
export const REDUCED_DURATION = 0.001;

/*
 * The two readers below are what the deck animates through, and they exist
 * because these durations are written straight into inline `transition`
 * strings — there is no `--ko-duration-*` token in the path for `styles.css`'s
 * reduced-motion rule to collapse, so the query has to be read in JS.
 *
 * What is *not* reduced is the drag itself. A card following a finger is
 * direct manipulation rather than animation: it moves because the hand moves,
 * it stops when the hand stops, and freezing it would take the gesture away
 * instead of calming it. Only the parts that play on their own once the hand
 * is off — the fly-out, the stack rising to the front behind it, and the
 * spring back from a drag that did not commit — are what this switches off.
 */

/** How long a committed card takes to leave, and to fade while it does. */
export function speedFor(speed: CommitSpeed): { fly: number; fade: number } {
  if (prefersReducedMotion()) return { fly: REDUCED_DURATION, fade: REDUCED_DURATION };
  return SPEEDS[speed];
}

/**
 * The beat between an answer changing and the card leaving on it.
 *
 * Collapsed under reduced motion along with everything else: with no flight to
 * separate the change from, a pause is a delay and nothing more.
 */
export function answerSwitchHold(): number {
  return prefersReducedMotion() ? REDUCED_DURATION : ANSWER_SWITCH_HOLD;
}

/** How long an abandoned drag takes to settle back to centre. */
export function springBackDuration(): number {
  return prefersReducedMotion() ? REDUCED_DURATION : SPRING_BACK_DURATION;
}

export function transform(x: number, y: number, rotation: number) {
  return `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
}

export function stackTransform(x: number, y: number, scale: number, rotate = 0) {
  return `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
}

/**
 * Read a drag offset as intent.
 *
 * Order matters: a downward drag is tested first and must clearly dominate, so
 * that a sloppy diagonal still registers as the left/right answer the user
 * meant rather than silently skipping the question.
 */
export function zoneForOffset(dx: number, dy: number): { zone: SwipeZone; important: boolean } | null {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  if (dy > PHYSICS.skipActivateY && absY > absX * PHYSICS.skipDominance) {
    return { zone: "skip", important: false };
  }

  if (absX > PHYSICS.zoneActivateX) {
    // Left is "Ano" — it matches the button order on the card.
    return {
      zone: dx < 0 ? "agree" : "disagree",
      important: dy < PHYSICS.importantLiftY,
    };
  }

  return null;
}

/** Whether a released drag travelled far enough to commit. */
export function shouldCommit(zone: SwipeZone, dx: number, dy: number): boolean {
  if (zone === "skip") return dy > PHYSICS.threshold;
  return Math.abs(dx) > PHYSICS.threshold;
}

export function exitTransform(zone: SwipeZone, important: boolean): string {
  if (zone === "skip") {
    return transform(0, EXIT.skipY, EXIT.skipRotation);
  }

  const sign = zone === "agree" ? -1 : 1;
  const lift = important ? EXIT.liftImportant : EXIT.liftNormal;

  return transform(sign * EXIT.horizontalX, lift, sign * EXIT.rotation);
}

/** Advancing to an already-answered card: no fling, just a lift and fade. */
export function advanceTransform(): string {
  return `translate(0px, ${EXIT.advanceY}px) scale(${EXIT.advanceScale})`;
}
