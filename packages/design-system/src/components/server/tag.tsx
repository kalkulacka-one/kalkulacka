// Ported from kalkulacka-2026/packages/ui/src/tag/tag.tsx and tag.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";

export type Tag = {
  children: React.ReactNode;
} & VariantProps<typeof TagVariants>;

export const TagVariants = cva(
  [
    "ko:inline-flex ko:items-center ko:flex-none",
    "ko:px-2 ko:py-[0.1875rem] ko:rounded-pill",
    "ko:font-sans ko:text-[0.6875rem] ko:font-semibold ko:tracking-[0.02em] ko:uppercase ko:whitespace-nowrap",
  ],
  {
    variants: {
      tone: {
        /** A positive callout — the winner's "Největší shoda". */
        agree: "ko:bg-agree-wash ko:text-agree",
        /*
         * A plain label. Not `ko:text-text-muted`: that token, composited under
         * the tag's own translucent wash (and, for "Vy" on the answers
         * comparison, a second wash from the tinted pill it sits inside), lands
         * as low as 3.1:1 — below WCAG AA's 4.5:1 for small text in every
         * combination measured (light and dark, tinted and plain). Full-strength
         * text clears every one of those combinations by a wide margin
         * (7.9–11.4:1) while the pill shape and uppercase tracking still keep it
         * reading as a label, not body copy.
         */
        neutral: "ko:bg-neutral-wash ko:text-text",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

/**
 * A small status label — a tinted pill, not styled text.
 *
 * Introduced for "Největší shoda" on the winner's row, which had been plain
 * uppercase coloured type with no shape of its own. That reads as an accent on
 * the name beside it rather than as the badge it is; a pill with a wash
 * background is legible as a distinct, named status at a glance.
 */
export function Tag({ children, tone }: Tag) {
  return <span className={twMerge(TagVariants({ tone }))}>{children}</span>;
}
