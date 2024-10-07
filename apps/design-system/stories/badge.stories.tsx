import { Badge } from "../../../packages/design-system/src/badge";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    color: {
      control: { type: "select", options: ["neutral", "secondary"] },
    },
    icon: { control: "boolean" },
  },
  tags: ["autodocs"],
} as Meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  args: {
    icon: false,
    color: "neutral",
    children: "Label",
  },
};

export const Primary: Story = {
  args: {
    icon: true,
    color: "neutral",
    children: "Label",
  },
};

export const Secondary: Story = {
  args: {
    icon: false,
    color: "secondary",
    children: "Label",
  },
};
