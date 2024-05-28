import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "@repo/design-system/card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    href: { control: "text" },
    children: { control: "text" },
  },
};
export default meta;

type CardStory = StoryObj<typeof meta>;

// Example story with minimal content
export const BasicCard: CardStory = {
  args: {
    title: "Welcome!",
    href: "https://example.com",
    children: "This is a simple card with text content.",
  },
};
