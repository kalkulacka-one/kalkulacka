import { extendTailwindMerge } from "tailwind-merge";

/*
 * Theme tokens declared in the design system's `styles.css` (radius, shadow,
 * fluid text/spacing scales, easing) are listed here so that, for example, a
 * later `ko:rounded-pill` drops an earlier `ko:rounded-2xl` the way built-in
 * values do. Colors and `font-*` need no listing: tailwind-merge already
 * accepts any word after them. Both the design system's `ko` prefix and the
 * app package's `koa` prefix share this list, since both consume the same
 * theme tokens.
 */
const themeExtension = {
  radius: ["card", "control", "chip", "pill"],
  shadow: ["card", "card-next", "card-back", "card-lifted", "sticky", "surface"],
  "drop-shadow": ["hard"],
  text: ["fluid-brand", "fluid-question", "fluid-gist", "fluid-chip", "fluid-action-label", "title", "display"],
  spacing: [
    "fluid-gutter",
    "fluid-header-top",
    "fluid-progress-top",
    "fluid-card-pad-top",
    "fluid-card-pad-side",
    "fluid-card-pad-bottom",
    "fluid-star",
    "fluid-action",
    "fluid-nav",
    "fade-edge",
    "fade-action",
    "scroll-tail",
  ],
  ease: ["spring", "exit"],
};

export function createTwMerge(prefix: string) {
  return extendTailwindMerge({
    prefix,
    extend: {
      theme: themeExtension,
    },
  });
}

export const twMerge = createTwMerge("ko");
