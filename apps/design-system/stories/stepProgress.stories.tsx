import type { Meta, StoryObj } from "@storybook/react";

import { StepProgress } from "@repo/design-system/stepProgress";
import { StepProgressFancy } from "@repo/design-system/stepProgressFancy";

const meta: Meta<typeof StepProgress> = {
  title: "Components/StepProgress",
  component: StepProgress,
};

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
