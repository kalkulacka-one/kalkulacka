import { extendTailwindMerge } from "tailwind-merge";

/*
 * Tokens from styles.css on tailwind-merge's closed-list scales, so they
 * conflict-resolve like built-ins; colors need no listing. A new token on
 * one of these scales must be added here in the same change.
 */
const themeExtension = {
  radius: ["card", "control", "chip", "pill"],
  shadow: ["surface", "card", "card-lifted", "sticky"],
  "drop-shadow": ["hard"],
  ease: ["spring", "exit"],
  spacing: ["gutter", "nav", "fade-edge", "scroll-tail"],
  text: ["title", "display"],
};

const classGroupExtension = {
  duration: [{ duration: ["fast", "base", "slow"] }],
};

export function createTwMerge(prefix: string) {
  return extendTailwindMerge({
    prefix,
    extend: {
      theme: themeExtension,
      classGroups: classGroupExtension,
    },
  });
}

export const twMerge = createTwMerge("ko");
