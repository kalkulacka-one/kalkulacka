import { extendTailwindMerge } from "tailwind-merge";

export type TwMergeTheme = Partial<Record<"font" | "text" | "spacing" | "radius" | "shadow" | "drop-shadow" | "ease" | "leading" | "tracking", string[]>>;

// The prefix goes in without its separator: `ko`, not `ko:`.
export function createTwMerge({ prefix, theme }: { prefix: string; theme?: TwMergeTheme }) {
  return extendTailwindMerge({ prefix, extend: { theme } });
}

export const twMerge = createTwMerge({
  prefix: "ko",
  theme: {
    font: ["display", "sans", "mono"],
    "drop-shadow": ["hard"],
    text: ["s"], // a font size, not a color
  },
});
