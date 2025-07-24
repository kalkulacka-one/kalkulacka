import type { Meta, StoryObj } from "@storybook/react";

import { DotIndicator } from "@repo/design-system/server";

const meta: Meta<typeof DotIndicator> = {
  title: "Components/DotIndicator",
  component: DotIndicator,
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
      control: {
        type: "number",
        min: 2,
      },
    },
  },
};

type DotIndicatorStory = StoryObj<typeof DotIndicator>;

export const Default: DotIndicatorStory = {
  args: {
    stepCurrent: 1,
    stepTotal: 4,
  },
};

export default meta;
