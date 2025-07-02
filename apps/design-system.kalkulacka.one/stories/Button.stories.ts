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
    disabled: {
      control: "boolean",
    },
    autoFocus: {
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
    autoFocus: false,
  },
};

export default meta;
