// Ported from kalkulacka-2026/packages/ui/src/donut/donut.stories.tsx
import { Donut } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof Donut> = {
  title: "Components/Donut",
  component: Donut,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    centerValue: "42",
    centerLabel: "otázek",
    segments: [
      { tone: "agree", value: 24, label: "Souhlas" },
      { tone: "disagree", value: 12, label: "Nesouhlas" },
      { tone: "none", value: 6, label: "Bez odpovědi" },
    ],
  },
  argTypes: {
    segments: { control: "object" },
    centerValue: { control: "text" },
    centerLabel: { control: "text" },
    size: { control: "number" },
    className: { control: false },
  },
};

type DonutStory = StoryObj<typeof meta>;

/** The real Pardubice shape for someone who answered 36 of 42. */
export const Default: DonutStory = {};

/** With explicit "nevím" answers in the mix — all four tones at once. */
export const WithNeutral: DonutStory = {
  args: {
    segments: [
      { tone: "agree", value: 18, label: "Souhlas" },
      { tone: "disagree", value: 11, label: "Nesouhlas" },
      { tone: "neutral", value: 7, label: "Nevím" },
      { tone: "none", value: 6, label: "Bez odpovědi" },
    ],
  },
};

/** Answered everything one way — a single segment gets no gap cut into it. */
export const Single: DonutStory = {
  args: { segments: [{ tone: "agree", value: 42, label: "Souhlas" }] },
};

/** Segments worth nothing are dropped rather than drawn as stray dots, from the legend too. */
export const WithEmptySegments: DonutStory = {
  args: {
    segments: [
      { tone: "agree", value: 30, label: "Souhlas" },
      { tone: "disagree", value: 0, label: "Nesouhlas" },
      { tone: "neutral", value: 0, label: "Nevím" },
      { tone: "none", value: 12, label: "Bez odpovědi" },
    ],
  },
};

/** Nothing answered yet: the track alone, and no legend. */
export const Nothing: DonutStory = {
  args: {
    centerValue: "0",
    segments: [
      { tone: "agree", value: 0, label: "Souhlas" },
      { tone: "disagree", value: 0, label: "Nesouhlas" },
    ],
  },
};

export const Larger: DonutStory = {
  args: { size: 180 },
};

export default meta;
