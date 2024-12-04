import { IconButton } from "@repo/design-system/ui";
import { StarIcon } from "@repo/design-system/icons";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/IconButton",
  component: IconButton,
  argTypes: {
    size: {
      control: { type: "select", options: ["small", "default", "large"] },
    },
    iconSize: {
      control: { type: "select", options: ["small", "default", "large"] },
    },
  },
  tags: ["autodocs"],
} as Meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    size: "default",
    iconSize: "default",
    icon: StarIcon,
    children: "Icon button",
  },
};
