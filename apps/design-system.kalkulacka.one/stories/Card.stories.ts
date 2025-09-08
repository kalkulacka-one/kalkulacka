import { Card } from "@repo/design-system/server";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    padding: "md",
    border: true,
    shadow: true,
    color: "white",
    corner: "bottomRight",
  },
  argTypes: {
    children: {
      control: false,
    },
    color: {
      control: "select",
      options: ["white", "transparent"],
    },
    corner: {
      control: "select",
      options: ["topRight", "topLeft", "bottomRight", "bottomLeft"],
    },
    border: {
      control: "boolean",
    },
    shadow: {
      control: "boolean",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
  },
};

type CardStory = StoryObj<typeof meta>;

export const Default: CardStory = {
  args: {
    children: "Card",
  },
};

export const PaddingSm: CardStory = {
  name: "Padding: sm",
  args: {
    padding: "sm",
    children: "Small padding",
  },
};

export const PaddingMd: CardStory = {
  name: "Padding: md",
  args: {
    padding: "md",
    children: "Medium padding (default)",
  },
};

export const PaddingLg: CardStory = {
  name: "Padding: lg",
  args: {
    padding: "lg",
    children: "Large + responsive padding",
  },
};

export const NoPadding: CardStory = {
  name: "Padding: none",
  args: {
    padding: "none",
    children: "No padding",
  },
};

export const NoShadow: CardStory = {
  name: "No shadow",
  args: {
    shadow: false,
    children: "Card without shadow",
  },
};

export const Transparent: CardStory = {
  name: "Transparent background",
  args: {
    color: "transparent",
    children: "Transparent card",
  },
};

export default meta;
