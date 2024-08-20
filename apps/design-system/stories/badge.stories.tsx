import { Badge } from "../../../packages/design-system/src/badge";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    color: { control: "color" },
    icon: { control: "boolean" },
    variant: {
      control: { type: "select", options: ["neutral", "primary", "secondary"] },
    },
  },
  tags: ["autodocs"],
} as Meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  args: {
    icon: false,
    variant: "neutral",
    children: "Label",
  },
};

export const Primary: Story = {
  args: {
    icon: true,
    variant: "primary",
    children: "Label",
  },
};

export const Secondary: Story = {
  args: {
    icon: false,
    variant: "secondary",
    children: "Label",
  },
};
