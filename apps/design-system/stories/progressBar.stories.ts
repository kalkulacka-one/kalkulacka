import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "@repo/design-system/progressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  argTypes: {
    color: {
      options: ["primary", "red", "orange", "yellow"],
      control: { type: "radio" },
    },
    progress: {
      control: {
        type: "number",
        min: 0,
        max: 100,
      },
    },
  },
};

type ProgressBarStory = StoryObj<typeof meta>;

export const Default: ProgressBarStory = {
  args: {
    progress: 50,
    color: "primary",
  },
};

export default meta;
