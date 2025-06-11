import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@repo/design-system/client";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
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
    type: "button",
    disabled: false,
    autoFocus: false,
  },
};

export default meta;
