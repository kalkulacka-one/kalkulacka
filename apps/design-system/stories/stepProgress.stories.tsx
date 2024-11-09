import type { Meta, StoryObj } from "@storybook/react";

import { StepProgress } from "@repo/design-system/ui";

const meta: Meta<typeof StepProgress> = {
  title: "Components/StepProgress",
  component: StepProgress,
};

type StepProgressStory = StoryObj<typeof meta>;

const steps = {
  answers: [
    { answerId: "1", status: true }, // positive step (e.g. answerInFavour)
    { answerId: "2", status: null },
    { answerId: "3", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
    { answerId: "4", status: false }, // negative step (e.g. answerAgainst)
    { answerId: "5", status: true },
    { answerId: "6", status: true }, //
    { answerId: "7", status: false },
    { answerId: "8", status: undefined }, // step with no sratus (e.g. not visited yet)
  ],
  totalQuestion: 4,
  currentQuestion: 8,
};

export const Plain: StepProgressStory = {
  args: { steps },
  render: (args) => <StepProgress {...args} />,
};

export default meta;
