import { Card } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    color: "white",
    corner: "topLeft",
    border: false,
    shadow: false,
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
      control: "select",
      options: [true, "hard", undefined],
    },
  },
};

type CardStory = StoryObj<typeof meta>;

export const Default: CardStory = {
  name: "Default card",
  args: {
    children: "Card",
  },
};

export const Transparent: CardStory = {
  name: "Transparent card",
  args: {
    color: "transparent",
    children: "Transparent card",
  },
};

export const ElevatedShadow: CardStory = {
  name: "Card with elevated shadow",
  args: {
    shadow: "elevated",
    children: "Card with elevated shadow",
  },
};

export const HardShadow: CardStory = {
  name: "Hard shadow",
  args: {
    shadow: "hard",
    children: "Card with hard shadow",
  },
};

export default meta;
