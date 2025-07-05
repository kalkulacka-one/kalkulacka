import type { Meta, StoryObj } from "@storybook/react";

import { Logo } from "@repo/design-system/server";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "boolean",
    },
    textPosition: {
      control: "select",
      options: ["horizontal", "vertical"],
      if: { arg: "text" },
    },
    children: {
      control: "text",
    },
  },
};

type LogoStory = StoryObj<typeof Logo>;

export const Default: LogoStory = {
  args: {
    text: true,
    children: "Volební kalkulačka",
    textPosition: "horizontal",
  },
};

export default meta;
