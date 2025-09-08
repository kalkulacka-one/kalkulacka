import { Button } from "@repo/design-system/client";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "fill",
    color: "primary",
    size: "medium",
    type: "button",
    disabled: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium"],
      defaultValue: {
        summary: "medium",
      },
    },
    variant: {
      control: "select",
      options: ["fill", "outline", "link", "answer"],
      defaultValue: {
        summary: "fill",
      },
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "neutral"],
      defaultValue: {
        summary: "primary",
      },
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      defaultValue: {
        summary: "button",
      },
    },
    disabled: {
      control: "boolean",
      defaultValue: {
        summary: false,
      },
    },
  },
};

type ButtonStory = StoryObj<typeof meta>;

export const Default: ButtonStory = {
  args: {
    children: "Button",
    variant: "fill",
    color: "primary",
    type: "button",
    disabled: false,
  },
};

export const Outline: ButtonStory = {
  args: {
    children: "Outline",
    variant: "outline",
    color: "primary",
  },
};

export const Link: ButtonStory = {
  args: {
    children: "Link",
    variant: "link",
    color: "primary",
  },
};

export const Answer: ButtonStory = {
  args: {
    children: "Answer",
    variant: "answer",
    color: "primary",
  },
};

export default meta;
