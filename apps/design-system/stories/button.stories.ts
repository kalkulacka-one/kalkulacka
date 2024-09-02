import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@repo/design-system/button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      options: [
        "default",
        "filled",
        "outline",
        "link",
        "answerInFavour",
        "answerAgainst",
        "answerNeutral",
      ],
      control: { type: "radio" },
    },
    size: {
      options: ["default", "sm", "icon"],
      control: { type: "radio" },
    },
  },
};

type ButtonStory = StoryObj<typeof meta>;

export const Default: ButtonStory = {
  args: {
    children: "Button label",
    size: "default",
    variant: "default",
  },
};

export default meta;
