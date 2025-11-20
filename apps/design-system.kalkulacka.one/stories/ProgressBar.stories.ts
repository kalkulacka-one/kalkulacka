import { ProgressBar } from "@kalkulacka-one/design-system/server";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: {
        type: "range",
        min: 0,
        max: 100,
      },
    },
  },
};

type ProgressBarStory = StoryObj<typeof meta>;

export const Default: ProgressBarStory = {
  args: {
    value: 50,
  },
};

export default meta;
