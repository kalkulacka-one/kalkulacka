"use client";

// Ported from kalkulacka-2026/packages/ui/src/calculating/calculating.tsx and calculating.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { AnswerMark, type AnswerMarkTone } from "../server/answerMark";
import { PercentMark } from "./logo";

export type Calculating = {
  /** What is being waited for, e.g. "Počítáme vaši shodu" — announced, not decorative. */
  label: string;
  className?: string;
};

/**
 * The tape. Fixed rather than random so the animation is identical on the server
 * and the client, and identical between two people comparing screens — it is
 * decoration standing in for the answers, not a reading of them.
 */
export const TAPE: { id: string; tone: AnswerMarkTone }[] = (
  [
    "agree",
    "disagree",
    "agree",
    "agree",
    "neutral",
    "disagree",
    "agree",
    "none",
    "disagree",
    "agree",
    "agree",
    "disagree",
    "neutral",
    "agree",
    "disagree",
    "agree",
    "agree",
    "none",
    "disagree",
    "agree",
    "neutral",
    "disagree",
    "agree",
    "agree",
  ] as AnswerMarkTone[]
).map((tone, index) => ({ id: `frame-${index}`, tone }));

const wrapClasses = "ko:flex ko:flex-col ko:items-center ko:gap-4";
const stageClasses = "ko:relative ko:size-38 ko:flex ko:items-center ko:justify-center";

/* Starts at twelve o'clock rather than at three. */
const ringClasses = "ko:absolute ko:inset-0 ko:size-full ko:-rotate-90";

/*
 * The gate: a circular aperture the tape is pulled through, sitting inside the
 * ring. Everything that moves — the ring counting, the tape rolling, the gate
 * shuttering and the mark landing — is `.ko-calculating-*` in `styles.css`.
 */
const gateClasses = "ko-calculating-gate ko:relative ko:size-28 ko:rounded-pill ko:overflow-hidden ko:bg-surface ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]";

/* Starts clear of the aperture so the first mark travels in rather than being
   there on frame one. */
const tapeClasses = "ko-calculating-tape ko:flex ko:items-center ko:gap-2 ko:h-full ko:pl-28 ko:w-max";

const sprocketsClasses = "ko-calculating-sprockets ko:absolute ko:left-0 ko:flex ko:gap-2 ko:pl-28 ko:w-max";

/* One hole per frame, as wide as the mark it rides above, with the dot centred in it. */
const holeClasses =
  "ko:flex-none ko:w-[2.125rem] ko:h-[0.3125rem] ko:flex ko:items-center ko:justify-center ko:before:content-[''] ko:before:size-[0.3125rem] ko:before:rounded-pill ko:before:bg-border-strong";

const percentClasses = "ko-calculating-percent ko:absolute ko:text-text-strong";

const labelClasses = "ko:m-0 ko:font-sans ko:text-[0.9375rem] ko:text-text-muted ko:text-center";

/**
 * The wait before the results.
 *
 * Your answers run through a gate on a strip of film while a ring counts around
 * it, and the whole thing resolves onto the percent sign out of the wordmark.
 * The pause it fills is not fake work — the calculation finishes before the
 * screen paints — it is the beat that lets someone register the result was
 * produced *from their answers* rather than having been sitting there all along.
 *
 * Under `prefers-reduced-motion` nothing moves: the gate is removed, the ring is
 * full, the percent mark is simply there, and the label carries the meaning.
 * See `.ko-calculating-*` in `styles.css`.
 */
export function Calculating({ label, className }: Calculating) {
  return (
    <div className={twMerge(wrapClasses, className)} role="status">
      <div className={stageClasses}>
        <svg className={ringClasses} viewBox="0 0 100 100" aria-hidden="true">
          <circle className="ko:stroke-surface-sunken" cx="50" cy="50" r="45" fill="none" strokeWidth={4} />
          <circle className="ko-calculating-ring-fill ko:stroke-agree" cx="50" cy="50" r="45" fill="none" strokeWidth={4} strokeLinecap="round" />
        </svg>

        <div className={gateClasses} aria-hidden="true">
          {/* Sprocket holes, top and bottom, running at the tape's own speed —
              they are what makes the strip read as film being pulled through
              rather than as icons sliding sideways. */}
          <div className={twMerge(sprocketsClasses, "ko:top-2")}>
            {TAPE.map((frame) => (
              <span key={frame.id} className={holeClasses} />
            ))}
          </div>

          <div className={tapeClasses}>
            {TAPE.map((frame) => (
              /* No labels: the strip stands in for the answers, it does not
                 report them, and this whole region is hidden from assistive tech
                 anyway. Naming all 24 would put a run of nonsense words in front
                 of the one sentence that means something. */
              <AnswerMark key={frame.id} tone={frame.tone} size="medium" />
            ))}
          </div>

          <div className={twMerge(sprocketsClasses, "ko:bottom-2")}>
            {TAPE.map((frame) => (
              <span key={frame.id} className={holeClasses} />
            ))}
          </div>
        </div>

        <PercentMark className={percentClasses} size={34} />
      </div>

      <p className={labelClasses}>{label}</p>
    </div>
  );
}
