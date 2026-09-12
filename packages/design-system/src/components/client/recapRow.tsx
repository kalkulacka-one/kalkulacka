"use client";

// Ported from kalkulacka-2026/packages/ui/src/recap-row/recap-row.tsx and recap-row.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { icons } from "../icons";
import { AnswerMark, type AnswerMarkTone } from "../server/answerMark";
import { Icon } from "./icon";

/*
 * The row's tone is `AnswerMarkTone` outright — it is handed straight to
 * `AnswerMark` and this file draws nothing from it itself. It had been a
 * narrower three-value `RecapTone` of its own, which bought no safety (the mark
 * accepts all four) and quietly asserted that a recap row can never be
 * `neutral`. Skipped and never-reached still read identically, both as `none`:
 * both are "no position taken", and the recap acts on neither. `Přeskočit`
 * remains an action, it just draws no different mark than leaving a question
 * untouched.
 */

export type RecapRowLabels = {
  /** How this row's state reads aloud, e.g. "Ano" or "Bez odpovědi". */
  answer: string;
  /** The star toggle's accessible name, e.g. "Pro mě důležité". */
  important: string;
};

export type RecapRowProps = {
  /** The short name — the row's headline. */
  title: string;
  tone: AnswerMarkTone;
  important: boolean;
  /**
   * Explicitly passed over. The mark still reads the same as a never-reached
   * question — the recap doesn't act on the difference — but the row itself
   * reads as secondary, and the star can't be armed from here: skipping
   * already clears "pro mě důležité" in the store, and re-arming it without
   * the actual question in front of you would attach the flag to a position
   * that was never taken.
   */
  skipped?: boolean;
  labels: RecapRowLabels;
  /** Opens the full question to change the answer. */
  onOpen: () => void;
  /** Toggled right here — it doesn't need the full card to change. */
  onToggleImportant: () => void;
};

/*
 * The card's shadow and its whole pointer behaviour are `.ko-pressable`'s, on
 * this element in the markup — hence the radius here as well as on the tile:
 * a shadow drawn on a square box behind a rounded tile shows at the corners.
 * No `ko:shadow-*` utility alongside it: the pressable class owns the shadow
 * at rest (`--ko-shadow-surface`) *and* on hover and press, and a utility,
 * layered after components, would pin it to the resting value.
 */
const itemClasses = "ko-pressable ko:list-none ko:flex ko:rounded-control";

/*
 * The tile itself: a plain surface lifted by a shadow rather than ringed by a
 * border, so the list reads as pieces resting on the page instead of boxes
 * drawn on it. Two buttons live inside it — the star and the open area — but
 * only this outer element carries the tile's look, so the pair still reads as
 * one continuous card with two things you can press.
 *
 * Padding is uniform on all four sides and the star/mark circles get no extra
 * padding of their own — that's what keeps the halo of whitespace around each
 * of them equal. The height comes from that padding plus the mark (the
 * larger of the two circles), not from a fixed `min-height`: a number chosen
 * independently of the circle it has to fit around is exactly how the two
 * drift out of balance.
 */
const rowClasses = [
  "ko:grid ko:grid-cols-[auto_minmax(0,1fr)_auto] ko:items-center ko:gap-2",
  "ko:w-full ko:p-2.5",
  "ko:rounded-control ko:bg-surface",
  "ko:transition-opacity ko:duration-[var(--ko-duration-base)] ko:ease-[ease]",
].join(" ");

/*
 * A skipped question reads as secondary — present, but visibly lower-priority
 * than one still genuinely open — without going as far as `:disabled`'s greyed,
 * inert look. The row itself stays fully interactive; only its star does not.
 */
const secondaryRowClasses = "ko:opacity-95";

/*
 * The star toggle: the same control the question card wears
 * (`QuestionCardActionVariants`' `important`), at the row's own scale — this
 * is the one answer that can change without opening the full card.
 *
 * No press transform of its own — the whole tile presses in under it
 * (`.ko-pressable`), and two nested scales on one tap read as a wobble.
 *
 * A skip already clears "pro mě důležité" in the store, so re-arming it here
 * — without the actual question in front of you — would be attaching the flag
 * to a position that was never taken. A real `disabled`, not just a dimmer
 * default: no hover wash, no focus ring, no click.
 */
const starClasses = [
  "ko:flex ko:flex-none ko:items-center ko:justify-center ko:size-8",
  "ko:border-0 ko:rounded-pill ko:bg-surface ko:text-neutral-ink ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)] ko:cursor-pointer",
  "ko:transition-[background-color,color,box-shadow] ko:duration-[var(--ko-duration-base)] ko:ease-[ease]",
  "ko:hover:bg-neutral-wash",
  "ko:focus-visible:outline-3 ko:focus-visible:outline-offset-2 ko:focus-visible:outline-focus/55",
  "ko:aria-pressed:bg-neutral-ink ko:aria-pressed:text-on-neutral-ink ko:aria-pressed:shadow-[inset_0_0_0_1.5px_var(--ko-color-neutral-ink)]",
  "ko:disabled:cursor-default ko:disabled:opacity-45 ko:disabled:hover:bg-surface",
].join(" ");

/*
 * The open area. No horizontal padding of its own — the row's own uniform
 * padding plus the grid gap ahead of it are already the whitespace around the
 * star and the mark. An extra inset here just on the mark's side is what threw
 * the two out of balance before. The focus ring is drawn inside the tile, so
 * it is not clipped by the row.
 */
const openClasses = [
  "ko:col-start-2 ko:col-end-4 ko:flex ko:items-center ko:justify-between ko:gap-3 ko:min-w-0 ko:h-full",
  "ko:p-0 ko:border-0 ko:rounded-[calc(var(--ko-radius-control)_-_0.25rem)] ko:bg-transparent ko:text-left ko:cursor-pointer",
  "ko:focus-visible:outline-3 ko:focus-visible:-outline-offset-2 ko:focus-visible:outline-focus/55",
].join(" ");

/*
 * Two lines is the ceiling: past that the rows in a grid column stop having a
 * shared rhythm and the list reads as cards again.
 */
const titleClasses = "ko:min-w-0 ko:font-sans ko:text-[0.9375rem] ko:font-semibold ko:leading-[1.3] ko:tracking-[-0.01em] ko:text-text-strong ko:line-clamp-2";

const secondaryTitleClasses = "ko:font-medium ko:text-text-muted";

/**
 * One question in the recap: a single line you can scan, not a card you have to
 * read.
 *
 * Two separate controls share one tile rather than the whole row being a
 * single button: the star is the same toggle the question card wears, and
 * toggling it here shouldn't have to open a dialog first. Everything else —
 * the title, the answer mark — opens the full question, because *that*
 * decision does need the card's actual statement in front of you.
 *
 * The answer mark itself is `AnswerMark` — shared with the results comparison,
 * so the two screens can't drift on what a "yes" looks like.
 */
export function RecapRow({ title, tone, important, skipped = false, labels, onOpen, onToggleImportant }: RecapRowProps) {
  /*
   * `ko-pressable` goes on the `<li>` rather than the tile inside it: hover and
   * press propagate up from whichever of the two buttons was reached for, so
   * the card answers the pointer as one piece — the same hover, press and depth
   * a results card has. See `.ko-pressable` in `styles.css`.
   */
  return (
    <li className={itemClasses}>
      <div className={twMerge(rowClasses, skipped && secondaryRowClasses)} data-secondary={skipped || undefined}>
        <button type="button" className={starClasses} aria-pressed={important} aria-label={labels.important} title={labels.important} onClick={onToggleImportant} disabled={skipped}>
          {/* Sized by height like the card's own marks, the width following the star's aspect ratio. */}
          <Icon icon={icons.star} size={null} filled={important} decorative className="ko:h-[15px] ko:w-auto" />
        </button>

        <button type="button" className={openClasses} onClick={onOpen}>
          <span className={twMerge(titleClasses, skipped && secondaryTitleClasses)}>{title}</span>

          <AnswerMark tone={tone} label={labels.answer} />
        </button>
      </div>
    </li>
  );
}
