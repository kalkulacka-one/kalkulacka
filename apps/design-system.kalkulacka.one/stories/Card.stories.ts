import { Card } from "@repo/design-system/server";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
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
  },
};

type CardStory = StoryObj<typeof meta>;

export const Default: CardStory = {
  args: {
    children: "Card",
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
