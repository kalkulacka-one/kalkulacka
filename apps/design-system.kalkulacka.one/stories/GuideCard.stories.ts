import type { Meta, StoryObj } from "@storybook/react";

import { GuideCard } from "@repo/design-system/server";

const meta: Meta<typeof GuideCard> = {
  title: "Components/GuideCard",
  component: GuideCard,
  tags: ["autodocs"],
  argTypes: {
    stepCurrent: {
      control: "number",
      min: 2,
      max: 4,
    },
  },
};

type GuideCardStory = StoryObj<typeof meta>;

export const Default: GuideCardStory = {
  args: {
    stepCurrent: 2,
  },
};

export default meta;
