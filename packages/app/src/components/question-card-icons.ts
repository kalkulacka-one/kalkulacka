/**
 * The 2026 answer marks — heavier check/cross glyphs than the design
 * system's default `logoCheck`/`logoCross`, used only on the question card's
 * Ano/Ne buttons. Colocated here rather than added to the shared icon set:
 * these two path strings are copied (and re-fit to the design system
 * `Icon`'s fixed 24×24 viewBox, uniformly scaled/centred, no shape change)
 * from the 2026 prototype's heavier marks — see
 * `packages/design-system/src/components/icons/icon-set.ts` on
 * `origin/redesign/p1-04-icon-solo` (`icons.check` / `icons.cross`).
 */
export const answerCheckIcon = "M18.5513 4L21.589 6.991L11.4192 17.0042L8.3815 19.9952L1.7778 13.4931L4.8155 10.5021L8.3815 14.0132L18.5513 4Z";
export const answerCrossIcon =
  "M16.7631 4L19.8007 6.991L14.7158 11.9976L19.8007 17.0043L16.763 19.9952L11.6781 14.9886L6.5932 19.9952L3.5556 17.0042L8.6404 11.9976L3.5556 6.991L6.5933 4L11.6782 9.0067L16.7631 4Z";
