import { extendTailwindMerge } from "tailwind-merge";

/*
 * tailwind-merge expects the Tailwind v4 prefix without its separator: `ko`
 * matches `ko:flex`. Theme tokens declared in `styles.css` are listed so that
 * a later `ko:rounded-pill` drops an earlier `ko:rounded-2xl` the way built-in
 * values do. Colors need no listing; any value after `bg-`, `text-` and the
 * like is treated as a color.
 */
export const twMerge = extendTailwindMerge({
  prefix: "ko",
  extend: {
    theme: {
      radius: ["card", "control", "chip", "pill"],
      shadow: ["card", "card-next", "card-back", "card-lifted", "sticky", "surface"],
      "drop-shadow": ["hard"],
      text: ["s", "fluid-brand", "fluid-question", "fluid-gist", "fluid-chip", "fluid-action-label", "title", "display"],
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
      font: ["display", "sans", "mono", "question"],
    },
  },
});
