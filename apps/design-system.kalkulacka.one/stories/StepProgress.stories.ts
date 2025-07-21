import type { Meta, StoryObj } from "@storybook/react";

import { StepProgress } from "@repo/design-system/server";

const meta: Meta<typeof StepProgress> = {
  title: "Components/StepProgress",
  component: StepProgress,
  tags: ["autodocs"],
  argTypes: {
    stepCurrent: {
      control: {
        type: "number",
        min: 1,
        max: 4,
      },
    },
    stepTotal: {
      control: false,
    },
  },
};

type StepProgressStory = StoryObj<typeof StepProgress>;

export const Default: StepProgressStory = {
  args: {
    stepCurrent: 1,
    stepTotal: 4,
  },
};

export default meta;
