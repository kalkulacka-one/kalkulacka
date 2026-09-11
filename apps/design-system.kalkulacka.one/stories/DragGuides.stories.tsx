import { DRAG_DIRECTIONS, DragGuides } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";

const labels = {
  agree: "Ano",
  disagree: "Ne",
  important: "Pro mě důležité",
  skip: "Přeskočit",
};

/**
 * The compass positions itself over a card's padding box, so the stories give
 * it a card-shaped surface to sit on. The band it fills stops above where the
 * card's action row would be, which is why the pills sit clear of the bottom
 * edge.
 */
const meta: Meta<typeof DragGuides> = {
  title: "Components/DragGuides",
  component: DragGuides,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { labels, split: false, active: null },
  argTypes: {
    split: { control: "boolean" },
    active: {
      control: "select",
      options: [null, ...DRAG_DIRECTIONS],
    },
    practised: { control: false },
    labels: { control: "object" },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: "relative",
          width: "min(90vw, 26rem)",
          height: "18rem",
          background: "var(--ko-color-surface)",
          borderRadius: "var(--ko-radius-card)",
          boxShadow: "var(--ko-shadow-card)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

type DragGuidesStory = StoryObj<typeof meta>;

/** Touch: icon-only pills, one diagonal arrow plus a star per "important" corner. */
export const Touch: DragGuidesStory = {};

/** Mouse: labelled pills, diagonals decomposed into an up arrow plus the answer's own arrow. */
export const Pointer: DragGuidesStory = {
  args: { split: true },
};

/** Directions already tried fade back, leaving the untried ones lit. */
export const Practised: DragGuidesStory = {
  args: { split: true, practised: new Set(["w", "s"] as const) },
};

/** The pill a drag is currently pointing at fills solid and lifts. */
export const ActiveDrag: DragGuidesStory = {
  args: { split: true, active: "ne" },
};

export default meta;
