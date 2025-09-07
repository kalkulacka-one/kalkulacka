import { Card } from "@repo/design-system/server";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
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
    hardShadow: {
      control: "select",
      options: ["none", "sm", "md", "lg", "primary", "secondary"],
    },
  },
};

type CardStory = StoryObj<typeof meta>;

export const Default: CardStory = {
  args: {
    children: "Card",
  },
};

export const WithHardShadowSmall: CardStory = {
  args: {
    children: "Card with small hard shadow",
    hardShadow: "sm",
  },
};

export const WithHardShadowMedium: CardStory = {
  args: {
    children: "Card with medium hard shadow",
    hardShadow: "md",
  },
};

export const WithHardShadowLarge: CardStory = {
  args: {
    children: "Card with large hard shadow",
    hardShadow: "lg",
  },
};

export const WithHardShadowPrimary: CardStory = {
  args: {
    children: "Card with hard shadow (primary size)",
    hardShadow: "primary",
  },
};

export const WithHardShadowSecondary: CardStory = {
  args: {
    children: "Card with hard shadow (secondary size)",
    hardShadow: "secondary",
  },
};

export const WithBothShadows: CardStory = {
  args: {
    children: "Card with both regular and hard shadow",
    shadow: true,
    hardShadow: "primary",
  },
};

export default meta;
