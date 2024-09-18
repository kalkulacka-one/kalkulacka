import type { Meta, StoryObj } from "@storybook/react";

import { Card } from "@repo/design-system/card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "lightgray",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

type CardStory = StoryObj<typeof meta>;

export const Default: CardStory = {
  args: {
    children: "Hello, World!",
    color: "white",
    corner: "topRight",
  },
};

export const Border: CardStory = {
  args: {
    children: "Hello, World!",
    color: "white",
    corner: "topRight",
    border: "default",
  },
};

export const BorderAndShadow: CardStory = {
  args: {
    children: "Hello, World!",
    color: "white",
    corner: "topRight",
    border: "default",
    shadow: "default",
  },
};

export default meta;
