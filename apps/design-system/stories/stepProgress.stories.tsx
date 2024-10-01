import type { Meta, StoryObj } from "@storybook/react";

import { StepProgress } from "@repo/design-system/stepProgress";

const meta: Meta<typeof StepProgress> = {
  title: "Components/StepProgress",
  component: StepProgress,
};

type StepProgressStory = StoryObj<typeof meta>;

export const Plain: StepProgressStory = {
  args: {
    currentStep: 1,
    totalStep: 8,
  },
  render: (args) => <StepProgress {...args} />,
};

export default meta;
