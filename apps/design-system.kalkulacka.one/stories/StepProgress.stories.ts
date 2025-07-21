import type { Meta, StoryObj } from "@storybook/react";

import { StepProgress } from "@repo/design-system/server";

const meta: Meta<typeof StepProgress> = {
  title: "Components/StepProgress",
  component: StepProgress,
  tags: ["autodocs"],
  args: {},
};

type StepProgressStory = StoryObj<typeof StepProgress>;

export const Default: StepProgressStory = {
  args: {
    stepCurrent: 0,
    stepTotal: 4,
  },
};

export default meta;
