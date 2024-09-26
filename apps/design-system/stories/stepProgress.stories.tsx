import type { Meta, StoryObj } from "@storybook/react";

import { StepProgress } from "@repo/design-system/stepProgress";
import { StepProgressFancy } from "@repo/design-system/stepProgressFancy";

const meta: Meta<typeof StepProgress> = {
  title: "Components/StepProgress",
  component: StepProgress,
};

const mockupData = {
  currentStep: 3,
  stepCount: 4,
  stepStatus: [
    { step: 1, status: true },
    { step: 2, status: false },
    { step: 3, status: null },
    { step: 4, status: undefined },
  ],
};

console.log(mockupData.stepStatus.map((step) => step.step));

type StepProgressStory = StoryObj<typeof meta>;

export const Plain: StepProgressStory = {
  args: {
    currentStep: 1,
    stepCount: 2,
  },
  render: (args) => <StepProgress {...args} />,
};

export const Fancy: StepProgressStory = {
  args: {
    currentStep: 1,
    stepCount: 2,
  },
  render: (args) => <StepProgressFancy {...args} />,
};

export default meta;
