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
    size: {
      control: { type: "select", options: ["with_icon", "no_icon"] },
    },
  },
  tags: ["autodocs"],
} as Meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  args: {
    icon: false,
    size: "no_icon",
    color: "neutral",
    children: "Label",
  },
};

export const Primary: Story = {
  args: {
    icon: true,
    size: "with_icon",
    color: "neutral",
    children: "Label",
  },
};

export const Secondary: Story = {
  args: {
    icon: false,
    size: "with_icon",
    color: "secondary",
    children: "Label",
  },
};
