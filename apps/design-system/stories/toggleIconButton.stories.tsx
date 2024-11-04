import { Meta, StoryObj } from "@storybook/react";
import { ToggleIconButton } from "@repo/design-system/toggleIconButton";

export default {
  title: "Components/ToggleIconButton",
  component: ToggleIconButton,
  argTypes: {},
  tags: ["autodocs"],
} as Meta;

type Story = StoryObj<typeof ToggleIconButton>;

export const Default: Story = {
  args: {
    iconDefault: () => <svg />,
    iconPressed: () => <svg />,
    children: "Click me",
  },
};
