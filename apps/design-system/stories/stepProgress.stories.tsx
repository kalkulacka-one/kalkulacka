import type { Meta, StoryObj } from "@storybook/react";

import { StepProgress } from "@repo/design-system/stepProgress";

const meta: Meta<typeof StepProgress> = {
  title: "Components/StepProgress",
  component: StepProgress,
};

type StepProgressStory = StoryObj<typeof meta>;

export const Default: StepProgressStory = {
  args: {
    children: "Step Progress",
    variant: "plain" || "fancy",
  },
};

export default meta;
