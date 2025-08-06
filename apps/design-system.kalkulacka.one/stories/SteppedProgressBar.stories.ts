import type { Meta, StoryObj } from "@storybook/react";

import { SteppedProgressBar } from "@repo/design-system/server";

const questions = [
  { id: 1, answer: 1 },
  { id: 2, answer: 2 },
  { id: 2, answer: 3 },
  { id: 2, answer: 3 },
];

const meta: Meta<typeof SteppedProgressBar> = {
  title: "Components/SteppedProgressBar",
  component: SteppedProgressBar,
  tags: ["autodocs"],
  argTypes: {
    stepCurrent: {
      control: {
        type: "number",
        min: 1,
      },
    },
    stepTotal: {
      control: {
        type: "number",
        min: 2,
        max: 25,
      },
    },
  },
};

type SteppedProgressBarStory = StoryObj<typeof SteppedProgressBar>;

export const Default: SteppedProgressBarStory = {
  args: {
    questions: questions,
    stepCurrent: 1,
    stepTotal: questions.length,
  },
};

export default meta;
