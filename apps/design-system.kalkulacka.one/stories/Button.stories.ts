import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@repo/design-system/client";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outline", "link"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "neutral"],
    },
    size: {
      control: "select",
      options: ["default", "small"],
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

type ButtonStory = StoryObj<typeof meta>;

export const Default: ButtonStory = {
  args: {
    children: "Button text",
    variant: "filled",
    color: "primary",
    type: "button",
    disabled: false,
  },
};

export default meta;
