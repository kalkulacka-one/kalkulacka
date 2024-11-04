import { StarIconButton } from "@repo/design-system/starIconButton";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/StarIconButton",
  component: StarIconButton,
  tags: ["autodocs"],
} as Meta;

type Story = StoryObj<typeof StarIconButton>;

export const Default: Story = {
  args: {
    pressed: true
  }
};
