import { VisuallyHidden } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

/**
 * Storybook can't demonstrate "invisible but announced" visually, so these
 * stories exist mainly so the component appears in the sidebar and its props
 * are documented. Inspect with a screen reader or the accessibility tree to see
 * it read while staying off-screen.
 */
const meta: Meta<typeof VisuallyHidden> = {
  title: "Components/VisuallyHidden",
  component: VisuallyHidden,
  tags: ["autodocs"],
  args: {
    children: "Announced to screen readers, invisible on screen",
  },
  argTypes: {
    children: {
      control: "text",
    },
    as: {
      control: "select",
      options: ["span", "div", "output"],
      defaultValue: {
        summary: "span",
      },
    },
    "aria-live": {
      control: "select",
      options: [undefined, "polite", "assertive"],
    },
  },
};

type VisuallyHiddenStory = StoryObj<typeof meta>;

export const Default: VisuallyHiddenStory = {};

/** Use `output`/`div` with `aria-live` for a status that changes without moving focus. */
export const LiveRegion: VisuallyHiddenStory = {
  args: {
    as: "output",
    "aria-live": "polite",
    children: "Odpověď zaznamenána: Ano",
  },
};

export default meta;
