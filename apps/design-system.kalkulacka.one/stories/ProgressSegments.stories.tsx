import { ProgressSegments, type Segment } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const partial: Segment[] = [
  { state: "agree" },
  { state: "agree", important: true },
  { state: "disagree" },
  { state: "skipped" },
  { state: "disagree", important: true },
  { state: "unanswered" },
  { state: "unanswered" },
  { state: "unanswered" },
];

/** 42 questions is the real Pardubice count — the segments get thin. */
const fullLength: Segment[] = Array.from({ length: 42 }, (_, i): Segment => {
  if (i > 25) return { state: "unanswered" };
  if (i % 7 === 0) return { state: "skipped" };
  if (i % 3 === 0) return { state: "disagree", important: i % 6 === 0 };
  return { state: "agree", important: i % 5 === 0 };
});

const meta: Meta<typeof ProgressSegments> = {
  title: "Components/ProgressSegments",
  component: ProgressSegments,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    currentIndex: { control: { type: "number", min: 0 } },
    label: { control: "text" },
    segments: { control: "object" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(90vw, 40rem)" }}>
        <Story />
      </div>
    ),
  ],
};

type ProgressSegmentsStory = StoryObj<typeof meta>;

/** Answered segments take the answer's colour; a skip stays idle; a dot marks "pro mě důležité". */
export const PartiallyAnswered: ProgressSegmentsStory = {
  args: { segments: partial, currentIndex: 5, label: "Otázka 6 z 8" },
};

/** The full run of 42, mixed states, with the current segment taller in the middle. */
export const FullLength: ProgressSegmentsStory = {
  args: { segments: fullLength, currentIndex: 26, label: "Otázka 27 z 42" },
};

/** Nothing answered yet: every segment idle, the first one enlarged. */
export const Start: ProgressSegmentsStory = {
  args: { segments: Array.from({ length: 42 }, (): Segment => ({ state: "unanswered" })), currentIndex: 0, label: "Otázka 1 z 42" },
};

export default meta;
