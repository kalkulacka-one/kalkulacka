import type { Meta, StoryObj } from "@storybook/react";

import { Guide } from "./guide";

const meta: Meta<typeof Guide> = {
  title: "Components/Guide",
  component: Guide,
  tags: ["autodocs"],
  argTypes: {
    stepCurrent: {
      control: "number",
      min: 2,
      max: 4,
    },
  },
};

type GuideStory = StoryObj<typeof meta>;

export const Default: GuideStory = {
  args: {
    stepCurrent: 2,
  },
};

export default meta;
