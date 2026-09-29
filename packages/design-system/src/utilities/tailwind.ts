import { extendTailwindMerge } from "tailwind-merge";

/*
 * Theme tokens declared in the design system's `styles.css` are listed here
 * so that, for example, a later `ko:rounded-pill` drops an earlier
 * `ko:rounded-2xl` the way built-in values do. Colors need no listing:
 * tailwind-merge already accepts any word after them. Durations are not a
 * tailwind-merge theme scale, so the named ones extend the class group
 * instead. Both the design system's `ko` prefix and the app package's `koa`
 * prefix share this list, since both consume the same theme tokens.
 */
const themeExtension = {
  radius: ["card", "control", "chip", "pill"],
  shadow: ["surface", "card", "card-lifted", "sticky"],
  "drop-shadow": ["hard"],
  ease: ["spring", "exit"],
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
