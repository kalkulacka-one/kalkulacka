"use client";

// Ported from kalkulacka-2026/packages/ui/src/filter-chips/filter-chips.tsx and filter-chips.module.css
import { Fragment } from "react";

import { VisuallyHidden } from "../server/visuallyHidden";

export type FilterOption = {
  id: string;
  label: string;
  /** How many items this filter would leave. Hidden when undefined. */
  count?: number;
  /** Draws a hairline before this chip — separates groups of unlike filters. */
  separatorBefore?: boolean;
};

export type FilterChipsProps = {
  /** Names the group for assistive tech; not drawn. */
  label: string;
  options: FilterOption[];
  /** The `id` of the active option. Exactly one is always active. */
  value: string;
  onChange: (id: string) => void;
};

/*
 * The container the row queries to decide between scrolling and wrapping —
 * its own width, not the viewport's, since an embed can be narrow inside a
 * wide page.
 */
const hostClasses = "ko:@container";

/*
 * The row scrolls sideways on a phone rather than wrapping to three lines. The
 * negative margin plus matching padding lets the first and last chip reach the
 * screen edge as they scroll past, instead of hitting an invisible wall inset
 * from it, while keeping them aligned with the content at rest. The block
 * padding is room for the focus ring, which the scroller would otherwise clip.
 *
 * Given real width — 44rem of *container* — the row wraps instead of
 * scrolling. Sideways scrolling is a phone affordance: on a desktop it hides
 * half the topics behind a gesture nobody makes with a mouse, which is the
 * opposite of "easy to filter".
 */
const scrollerClasses = [
  "ko:overflow-x-auto ko:overflow-y-hidden ko:overscroll-x-contain",
  "ko:[scrollbar-width:none] ko:[&::-webkit-scrollbar]:hidden ko:[-webkit-overflow-scrolling:touch]",
  "ko:-mx-3 ko:px-3 ko:py-[3px]",
  "ko:@[44rem]:overflow-visible ko:@[44rem]:mx-0 ko:@[44rem]:px-0",
].join(" ");

/*
 * A `<fieldset>`, so the UA's own box has to be flattened: the default border,
 * padding and `min-inline-size: min-content` would each break the scrolling
 * row on their own (the preflight already takes the first two; `ko:min-w-0`
 * takes the last). As wide as its chips, so the scroller has something to
 * scroll — until the container is wide enough to wrap, where it takes the
 * width it is given.
 */
const rowClasses = "ko:flex ko:items-center ko:gap-2 ko:m-0 ko:p-0 ko:border-0 ko:w-max ko:min-w-0 ko:@[44rem]:flex-wrap ko:@[44rem]:w-auto";

/*
 * Translucent, like the plate buttons and the sticky bar: this floats over the
 * moving wash, and an opaque grey chip would punch a hole in it. The pressed
 * chip wears the neutral ink — the same fill the important star and the
 * deck's hint pill use.
 */
export const FilterChipClasses = [
  "ko:inline-flex ko:items-center ko:gap-1.5 ko:flex-none",
  "ko:min-h-8 ko:px-3 ko:border-0 ko:rounded-pill ko:cursor-pointer",
  "ko:font-sans ko:text-[0.8125rem] ko:font-semibold ko:tracking-[-0.005em] ko:whitespace-nowrap",
  "ko:bg-surface/70 ko:text-text-muted ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]",
  "ko:backdrop-blur-[12px] ko:backdrop-saturate-[1.4]",
  "ko:transition-[background-color,color,box-shadow] ko:duration-[var(--ko-duration-base)] ko:ease-[ease]",
  "ko:hover:bg-surface ko:hover:text-text-strong",
  "ko:focus-visible:outline-3 ko:focus-visible:outline-offset-2 ko:focus-visible:outline-focus/55",
  "ko:aria-pressed:bg-neutral-ink ko:aria-pressed:text-on-neutral-ink ko:aria-pressed:shadow-[inset_0_0_0_1.5px_var(--ko-color-neutral-ink)]",
].join(" ");

const countClasses = "ko:tabular-nums ko:opacity-65";

/*
 * Marks where one kind of filter ends and another begins — "how far did I get"
 * versus "which topic". Without it the row reads as one flat list of twelve
 * equivalent options, which is exactly what it is not.
 */
const dividerClasses = "ko:flex-none ko:w-px ko:h-5 ko:mx-1 ko:bg-border-strong";

/**
 * A single-select row of filter chips.
 *
 * Toggle buttons rather than radios: the row scrolls sideways on a phone, and
 * arrow keys inside a radiogroup would fight the horizontal scroll they also
 * control. `aria-pressed` on plain buttons keeps the state announced without
 * claiming a keyboard model this doesn't implement.
 */
export function FilterChips({ label, options, value, onChange }: FilterChipsProps) {
  return (
    <div className={hostClasses}>
      <div className={scrollerClasses}>
        {/* A real `<fieldset>`/`<legend>` pair rather than `role="group"` — the
            grouping is native, so it needs no ARIA to be announced. */}
        <fieldset className={rowClasses}>
          <VisuallyHidden as="legend">{label}</VisuallyHidden>

          {options.map((option) => (
            <Fragment key={option.id}>
              {option.separatorBefore ? <span className={dividerClasses} aria-hidden="true" /> : null}

              <button type="button" className={FilterChipClasses} aria-pressed={option.id === value} onClick={() => onChange(option.id)}>
                {option.label}
                {option.count === undefined ? null : <span className={countClasses}>{option.count}</span>}
              </button>
            </Fragment>
          ))}
        </fieldset>
      </div>
    </div>
  );
}
