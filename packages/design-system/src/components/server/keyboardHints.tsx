// Ported from kalkulacka-2026/packages/ui/src/keyboard-hints/keyboard-hints.tsx and keyboard-hints.module.css
import { Icon } from "../client/icon";
import type { IconDefinition } from "../icons";

/**
 * A key cap: either literal text (`","`) or an icon plus the name a screen
 * reader should read in its place. The name arrives as a prop rather than
 * from a lookup because this package holds no strings of its own.
 */
export type HintKey = string | { icon: IconDefinition | string; label: string };

export type KeyboardHint = {
  /** Rendered as separate `<kbd>` caps, e.g. `[",", "."]`. */
  keys: HintKey[];
  label: string;
};

export type KeyboardHintsProps = {
  hints: KeyboardHint[];
};

/*
 * Desktop only — there's no physical keyboard to hint at on the phone-sized
 * layout this app mostly runs at, and the row has nowhere to go on a narrow
 * screen without crowding the nav above it. `desk` is the breakpoint where a
 * keyboard is assumed (see the theme), the same "is there room" reasoning the
 * answer-button labels use for their own threshold.
 *
 * Hidden with `display: none` rather than removed from the tree so the markup
 * is the same at every width — only the breakpoint decides, no JavaScript.
 */
const hintsClasses = "ko:hidden ko:desk:flex ko:justify-center ko:flex-wrap ko:gap-x-6 ko:gap-y-2 ko:pt-4 ko:pb-2 ko:font-sans ko:text-sm ko:text-text-muted";

const hintClasses = "ko:inline-flex ko:items-center ko:gap-2 ko:whitespace-nowrap";

const keysClasses = "ko:inline-flex ko:gap-[0.1875rem]";

/*
 * The cap is drawn at a 1px hairline rather than the app's 1.5px border: at
 * this size the heavier line out-shouts the 1.5-on-24 icon sitting inside it,
 * and the cap would read louder than the arrow it contains. The chip radius,
 * so a cap sits in the same family as the topic chip on the card above it.
 */
const keyClasses = [
  "ko:inline-flex ko:items-center ko:justify-center ko:min-w-6 ko:h-6 ko:px-[0.3125rem]",
  "ko:rounded-chip ko:bg-surface ko:shadow-[inset_0_0_0_1px_var(--ko-color-border-strong)]",
  "ko:font-sans ko:text-[0.8125rem] ko:font-medium ko:text-text",
].join(" ");

/* Text keys are their own id; an icon key is a definition object, so its spoken name stands in. */
function keyId(key: HintKey) {
  return typeof key === "string" ? key : key.label;
}

/**
 * A reference row for the keyboard shortcuts, shown only where there's both a
 * keyboard and room for it (see the `desk` breakpoint above). Purely
 * informational — no interactive elements, so it costs nothing in the tab
 * order — but left in the accessibility tree rather than `aria-hidden`,
 * since a keyboard user is exactly who benefits from it existing.
 *
 * An icon key is named through the icon itself (`role="img"` with its
 * `label` as the title) rather than an `aria-label` on the `<kbd>`: a `<kbd>`
 * has no role that accepts a name, so a label on it is the one thing here a
 * screen reader is allowed to ignore.
 */
export function KeyboardHints({ hints }: KeyboardHintsProps) {
  return (
    <div className={hintsClasses}>
      {hints.map((hint) => (
        <span key={hint.label} className={hintClasses}>
          <span className={keysClasses}>
            {hint.keys.map((key) => (
              <kbd key={keyId(key)} className={keyClasses}>
                {typeof key === "string" ? key : <Icon icon={key.icon} size="xsmall" title={key.label} decorative={false} />}
              </kbd>
            ))}
          </span>
          {hint.label}
        </span>
      ))}
    </div>
  );
}
