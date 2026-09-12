// Ported from kalkulacka-2026/packages/ui/src/meter/meter.stories.tsx
import { Meter } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof Meter> = {
  title: "Components/Meter",
  component: Meter,
  tags: ["autodocs"],
  args: { value: 72 },
  argTypes: {
    value: { control: { type: "range", min: -20, max: 140 } },
    tone: {
      control: "select",
      options: ["agree", "neutral"],
      defaultValue: { summary: "agree" },
    },
    size: {
      control: "select",
      options: ["small", "medium"],
      defaultValue: { summary: "medium" },
    },
    delay: { control: "number" },
    label: { control: "text" },
    accent: { control: "color" },
    className: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(90vw, 16rem)" }}>
        <Story />
      </div>
    ),
  ],
};

type MeterStory = StoryObj<typeof meta>;

export const Agree: MeterStory = {};

export const Neutral: MeterStory = {
  args: { tone: "neutral" },
};

export const Small: MeterStory = {
  args: { size: "small" },
};

/** Values outside 0–100 are clamped rather than overflowing the track. */
export const Clamped: MeterStory = {
  args: { value: 140 },
};

/** The results list staggers these so the bars arrive with their rows. */
export const Delayed: MeterStory = {
  args: { delay: 0.6 },
};

/** Labelled bars are announced as a meter; unlabelled ones are decorative only. */
export const Labelled: MeterStory = {
  args: { value: 63, label: "Shoda 63 %" },
};

/** The ranking paints each candidate's own colour over the tone's ink. */
export const Accent: MeterStory = {
  args: { accent: "light-dark(#d97706, #fbbf24)" },
};

export default meta;
