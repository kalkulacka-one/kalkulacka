import { extendTailwindMerge } from "tailwind-merge";

/**
 * The custom values a package declares in its own `@theme` block, grouped by the
 * utility they belong to. tailwind-merge needs them to tell `text-s` (a font
 * size) apart from `text-primary` (a color); without them it reads any unknown
 * `text-*` value as a color and drops the font size.
 */
export type TwMergeTheme = Partial<Record<"font" | "text" | "spacing" | "radius" | "shadow" | "drop-shadow" | "ease" | "leading" | "tracking", string[]>>;

/**
 * Builds a class merger for one Tailwind namespace.
 *
 * A tailwind-merge instance recognises exactly one prefix, so every package
 * with its own prefixed Tailwind build needs its own merger, configured with
 * the theme that build actually has. Note the prefix is passed *without* its
 * separator: `ko` matches `ko:flex`. Passing `ko:` makes every class look
 * external and merging silently becomes a no-op.
 *
 * Colors need no listing — tailwind-merge treats any value after `bg-`,
 * `text-`, `border-` and the like as a color already.
 */
export function createTwMerge({ prefix, theme }: { prefix: string; theme?: TwMergeTheme }) {
  return extendTailwindMerge({ prefix, extend: { theme } });
}

/**
 * Merges the design system's `ko:` classes.
 * Keep the theme in step with the `@theme` block in `src/styles.css`.
 */
export const twMerge = createTwMerge({
  prefix: "ko",
  theme: {
    font: ["display", "sans", "mono"],
    "drop-shadow": ["hard"],
    text: ["s"],
  },
});
