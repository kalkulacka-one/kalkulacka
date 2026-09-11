import { DotIndicator } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof DotIndicator> = {
  title: "Components/DotIndicator",
  component: DotIndicator,
  tags: ["autodocs"],
  argTypes: {
    stepCurrent: {
      control: {
        type: "number",
        min: 1,
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
