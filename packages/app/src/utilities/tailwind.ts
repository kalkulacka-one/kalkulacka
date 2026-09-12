import { createTwMerge } from "@kalkulacka-one/design-system/utilities";

/**
 * Merges the app package's `koa:` classes. The design system's merger only
 * knows `ko:` and would treat every `koa:` class as external, so this package
 * needs its own instance.
 *
 * Keep the theme in step with the `@theme` block in `src/styles.css`.
 */
export const twMerge = createTwMerge({
  prefix: "koa",
  theme: {
    font: ["display"],
  },
});
