"use client";

// Ported from kalkulacka-2026/packages/ui/src/question-card/question-card.tsx and question-card.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode, PointerEvent as ReactPointerEvent, Ref } from "react";

import { icons } from "../icons";
import { Chip } from "../server/chip";
import { Icon } from "./icon";

/** Everything the card needs to render one question. */
export type QuestionCardContent = {
  id: string;
  /**
   * The statement being agreed or disagreed with.
   *
   * Optional because the tutorial's practice card has nothing to agree with:
   * it is a surface to put your hands on, and the only text it carries is the
   * instruction for doing so, which belongs in `detail`. Every card in the
   * flow itself has one.
   */
  statement?: string;
  /**
   * Short label for the outlined chip. Optional along with `topic` — the
   * practice card has neither, so the chips row it would have started can be
   * skipped instead of rendered empty.
   */
  title?: string;
  /** Optional explainer paragraph. */
  detail?: string;
  /** Topic, shown as the filled chip. */
  topic?: string;
};

/** Which control reads as selected. */
export type CardSelection = {
  agree: boolean;
  disagree: boolean;
  important: boolean;
};

export type QuestionCardLabels = {
  agree: string;
  disagree: string;
  important: string;
};

export type QuestionCardElevation = NonNullable<VariantProps<typeof QuestionCardVariants>["elevation"]>;

export type QuestionCard = {
  content: QuestionCardContent;
  selection: CardSelection;
  labels: QuestionCardLabels;
  /** Omitted for the decorative cards stacked behind the active one. */
  onAgree?: () => void;
  onDisagree?: () => void;
  onToggleImportant?: () => void;
  onPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void;
  /**
   * A classic corner close control — only ever set by the recap's dialog,
   * which is the one place a question card is dismissible without being
   * answered. The deck never passes this: its cards leave by swiping or
   * answering, not by being closed.
   */
  close?: { label: string; onClose: () => void };
  /**
   * Decoration drawn over the card's own content — the tutorial's drag
   * compass, and nothing else so far. Inside the card rather than layered on
   * the deck above it, so it travels with the card under a drag: an arrow that
   * stayed behind while the card moved would be pointing at where the card used
   * to be.
   */
  guides?: ReactNode;
  /**
   * What element the statement is drawn as.
   *
   * A paragraph by default, which is what the stacked, ghosted and practice
   * cards want — none of them is the thing a reader has arrived at. The card
   * actually being answered passes a heading instead: on the question flow the
   * statement *is* the screen's content, and drawn as a `<p>` it left that
   * screen with no heading at all for a screen reader to navigate by. Styling
   * lives entirely in the statement's class list, so this changes the
   * semantics and nothing about how the card looks.
   */
  statementAs?: "p" | "h1" | "h2";
  /** Non-interactive cards are hidden from assistive tech and the tab order. */
  inert?: boolean;
  elevation?: QuestionCardElevation;
  ref?: Ref<HTMLDivElement>;
  className?: string;
};

/**
 * The card's surface. Fills whatever positioned box the caller gives it — the
 * deck's stage, the recap dialog's frame, a story's decorator.
 */
export const QuestionCardVariants = cva(
  [
    "ko:absolute ko:inset-0",
    "ko:flex ko:flex-col ko:overflow-hidden",
    "ko:bg-surface ko:rounded-card ko:border ko:border-border",
    "ko:pt-fluid-card-pad-top ko:px-fluid-card-pad-side ko:pb-fluid-card-pad-bottom",
    /*
     * Labels on the answer buttons appear once the card itself is wide enough,
     * not once the window is. Inside an embed the two are very different things.
     */
    "ko:@container/card",
    "ko:origin-center",
  ],
  {
    variants: {
      elevation: {
        active: "ko:shadow-card",
        next: "ko:shadow-card-next",
        back: "ko:shadow-card-back",
        lifted: "ko:shadow-card-lifted",
      },
      /*
       * Keyed to `onPointerDown`, which is what actually makes the card draggable —
       * not to `onAgree`, which only means its buttons work. The recap's dialog
       * renders an answerable card that is *not* on a deck, and a grab cursor over
       * something that cannot be grabbed is a promise the card can't keep.
       */
      interactive: {
        true: "ko:cursor-grab ko:active:cursor-grabbing ko:touch-none ko:select-none",
        false: "",
      },
    },
    defaultVariants: {
      elevation: "active",
      interactive: false,
    },
  },
);

/**
 * The three controls in the action row. The star is a square toggle, the two
 * answers share the row's remaining width. Selection is read from
 * `aria-pressed`, so the pressed look can never drift from what a screen
 * reader is told.
 */
export const QuestionCardActionVariants = cva(
  [
    "ko:relative ko:flex ko:items-center ko:justify-center ko:gap-3",
    "ko:border-0 ko:bg-surface ko:text-neutral-ink ko:cursor-pointer",
    "ko:transition-[background-color,box-shadow,color,transform] ko:duration-[var(--ko-duration-base),var(--ko-duration-base),var(--ko-duration-base),var(--ko-duration-fast)] ko:ease-[ease]",
    "ko:focus-visible:outline-3 ko:focus-visible:outline-offset-2 ko:focus-visible:outline-focus/55",
  ],
  {
    variants: {
      action: {
        important: [
          /* The hook for the tooltip's hover/focus rules in `styles.css`. */
          "ko-question-card-important",
          "ko:size-fluid-star ko:flex-none ko:rounded-pill",
          "ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]",
          "ko:hover:bg-neutral-wash ko:active:scale-[0.96]",
          "ko:aria-pressed:bg-neutral-ink ko:aria-pressed:text-on-neutral-ink ko:aria-pressed:shadow-[inset_0_0_0_1.5px_var(--ko-color-neutral-ink)]",
        ],
        agree: [
          "ko:flex-1 ko:h-fluid-action ko:rounded-control ko:active:scale-[0.985]",
          "ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-agree-soft)]",
          "ko:hover:bg-agree-wash",
          "ko:aria-pressed:bg-agree ko:aria-pressed:text-on-agree ko:aria-pressed:shadow-[inset_0_0_0_1.5px_var(--ko-color-agree)]",
        ],
        disagree: [
          "ko:flex-1 ko:h-fluid-action ko:rounded-control ko:active:scale-[0.985]",
          "ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-disagree-soft)]",
          "ko:hover:bg-disagree-wash",
          "ko:aria-pressed:bg-disagree ko:aria-pressed:text-on-disagree ko:aria-pressed:shadow-[inset_0_0_0_1.5px_var(--ko-color-disagree)]",
        ],
      },
    },
  },
);

/*
 * A classic modal close — inset by the same padding the chips row starts at,
 * so its top edge lines up with theirs instead of sitting flush with the
 * card's literal corner (an absolutely positioned child's containing block is
 * the padding *box*, not the content box, so that alignment has to be spelled
 * out explicitly).
 */
const closeClasses = [
  "ko:absolute ko:top-fluid-card-pad-top ko:right-fluid-card-pad-side ko:z-1",
  "ko:flex ko:flex-none ko:items-center ko:justify-center ko:size-8",
  "ko:border-0 ko:rounded-pill ko:bg-surface ko:text-neutral-ink ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)] ko:cursor-pointer",
  "ko:transition-[background-color,box-shadow,transform] ko:duration-[var(--ko-duration-base),var(--ko-duration-base),var(--ko-duration-fast)] ko:ease-[ease]",
  "ko:hover:bg-neutral-wash ko:active:scale-[0.94]",
  "ko:focus-visible:outline-3 ko:focus-visible:outline-offset-2 ko:focus-visible:outline-focus/55",
].join(" ");

/*
 * Centred via auto margins, not `justify-content: center`: with an overflowing
 * flex container, `justify-content` splits the overflow both ways and the top
 * half becomes unreachable — a long statement opened mid-sentence with its
 * beginning clipped above the scroll. Auto margins give the same centring when
 * the text fits and collapse to zero when it doesn't, so a scrolling card
 * starts at the top.
 */
const bodyClasses = "ko:flex-1 ko:min-h-0 ko:flex ko:flex-col ko:overflow-y-auto ko:[&>:first-child]:mt-auto ko:[&>:last-child]:mb-auto";

/*
 * Room for the drag compass, which is an overlay — it cannot push text out of
 * its own way, so the card that carries it holds its own text clear instead.
 *
 * Vertical, not horizontal. The pills ring the band's top corners (the two
 * diagonals) and its bottom edge (left, down, right): two horizontal rows,
 * with nothing at all at mid-height where this used to reserve a gutter. That
 * gutter cost the text an extra wrapped line *and* left it colliding with the
 * row underneath — reserving the wrong axis is worse than reserving nothing.
 */
const bodyPadding = { plain: "ko:py-2", guided: "ko:py-11" } as const;

const statementClasses = "ko:m-0 ko:font-question ko:text-fluid-question ko:leading-[1.22] ko:font-bold ko:tracking-[-0.03em] ko:text-text ko:text-pretty";

const detailClasses = "ko:font-sans ko:text-fluid-gist ko:leading-[1.62] ko:text-text-muted";

/*
 * The only text on the card, which is the tutorial's practice card and nothing
 * else. It loses the gap that separates it from a statement, and it centres:
 * as a footnote under a question it is left-aligned prose, but alone in the
 * middle of a card ringed by direction pills it is a caption for them, and a
 * ragged block hugging one edge reads as text that lost its heading.
 */
const detailPlacement = { underStatement: "ko:mt-[1.125rem] ko:text-pretty", alone: "ko:mt-0 ko:text-center ko:text-balance" } as const;

/*
 * 600px is comfortable headroom, not a tight fit: the label row only needs
 * ~350px at any viewport wide enough to reach this in the first place (the
 * fluid card padding is viewport-driven, not container-driven, so it doesn't
 * shrink here). Keep this well below the card's likely width in normal use —
 * the app's own gutters and max-width already eat a good chunk of the
 * viewport before the card ever sees it.
 */
const answerLabelClasses = "ko:hidden ko:@[37.5rem]/card:inline ko:font-sans ko:text-fluid-action-label ko:font-semibold ko:tracking-[-0.02em] ko:whitespace-nowrap";

/**
 * A single question card.
 *
 * Used for the active card, the two stacked behind it, and the copy that flies
 * away when an answer is committed — hence the `inert` and `elevation` props
 * rather than four near-identical components.
 */
export function QuestionCard({
  content,
  selection,
  labels,
  onAgree,
  onDisagree,
  onToggleImportant,
  onPointerDown,
  close,
  guides,
  statementAs: Statement = "p",
  inert = false,
  elevation = "active",
  ref,
  className,
}: QuestionCard) {
  const interactive = !inert && Boolean(onPointerDown);

  return (
    <div
      ref={ref}
      className={twMerge(QuestionCardVariants({ elevation, interactive }), className)}
      onPointerDown={onPointerDown}
      // Cards behind the active one are decoration; screen readers and the tab
      // order should only ever see the question actually being answered.
      inert={inert}
      aria-hidden={inert || undefined}
    >
      {close ? (
        <button type="button" className={closeClasses} aria-label={close.label} title={close.label} onPointerDown={stopPropagation} onClick={close.onClose} tabIndex={inert ? -1 : undefined}>
          <Icon icon={icons.close} size="xsmall" decorative />
        </button>
      ) : null}

      {guides}

      {content.topic || content.title ? (
        /* Reserves room for the corner close button so a long topic/title pair
           wraps around it instead of running underneath it. Only applied when
           `close` is actually passed — the deck's cards never carry this
           control. */
        <div className={twMerge("ko:flex ko:flex-none ko:flex-wrap ko:gap-2", close && "ko:pr-10")}>
          {content.topic ? <Chip variant="filled">{content.topic}</Chip> : null}
          {content.title ? <Chip variant="outline">{content.title}</Chip> : null}
        </div>
      ) : null}

      <div className={twMerge(bodyClasses, guides ? bodyPadding.guided : bodyPadding.plain)}>
        {content.statement ? <Statement className={statementClasses}>{content.statement}</Statement> : null}
        {content.detail ? <p className={twMerge(detailClasses, content.statement ? detailPlacement.underStatement : detailPlacement.alone)}>{content.detail}</p> : null}
      </div>

      <div className="ko:flex ko:flex-none ko:items-center ko:gap-3">
        <button
          type="button"
          className={twMerge(QuestionCardActionVariants({ action: "important" }))}
          aria-pressed={selection.important}
          aria-label={labels.important}
          onPointerDown={stopPropagation}
          onClick={onToggleImportant}
          tabIndex={inert ? -1 : undefined}
        >
          {/* The prototype's marks are sized by height, the width following each
              one's own aspect ratio — so Icon's square sizes are switched off. */}
          <Icon icon={icons.star} size={null} filled={selection.important} decorative className="ko:h-[23px] ko:w-auto" />
          <span className="ko-question-card-tooltip" aria-hidden="true">
            {labels.important}
          </span>
        </button>

        <button
          type="button"
          className={twMerge(QuestionCardActionVariants({ action: "agree" }))}
          aria-pressed={selection.agree}
          aria-label={labels.agree}
          onPointerDown={stopPropagation}
          onClick={onAgree}
          tabIndex={inert ? -1 : undefined}
        >
          <Icon icon={icons.check} size={null} decorative className="ko:h-[21px] ko:w-auto" />
          <span className={answerLabelClasses}>{labels.agree}</span>
        </button>

        <button
          type="button"
          className={twMerge(QuestionCardActionVariants({ action: "disagree" }))}
          aria-pressed={selection.disagree}
          aria-label={labels.disagree}
          onPointerDown={stopPropagation}
          onClick={onDisagree}
          tabIndex={inert ? -1 : undefined}
        >
          <Icon icon={icons.cross} size={null} decorative className="ko:h-[21px] ko:w-auto" />
          <span className={answerLabelClasses}>{labels.disagree}</span>
        </button>
      </div>
    </div>
  );
}

/** Pressing a button must not also start dragging the card. */
function stopPropagation(event: ReactPointerEvent<HTMLButtonElement>) {
  event.stopPropagation();
}
