import type { Meta, StoryObj } from "@storybook/react";

import { ButtonText } from "@repo/design-system/ui";

const meta: Meta<typeof ButtonText> = {
  title: "Typography/Button",
  component: ButtonText,
  argTypes: {
    variant: {
      control: "radio",
      options: ["extraSmall", "small"],
    },
  },
};

type ButtonTextStory = StoryObj<typeof meta>;

export const Small: ButtonTextStory = {
  args: {
    children: "Button text",
    variant: "small",
  },
};

export const ExtraSmall: ButtonTextStory = {
  args: {
    children: "Button text",
    variant: "extraSmall",
  },
};
export default meta;
