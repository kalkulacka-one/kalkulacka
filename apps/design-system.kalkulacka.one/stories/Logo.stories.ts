import type { Meta, StoryObj } from "@storybook/react";

import { Logo } from "@repo/design-system/server";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {
    logoName: {
      control: "text",
    },
    textPosition: {
      control: "select",
      options: ["horizontal", "vertical"],
      if: { arg: "children" },
    },
    children: {
      control: "text",
    },
  },
};

type LogoStory = StoryObj<typeof Logo>;

export const Default: LogoStory = {
  args: {
    logoName: "Volební kalkulačka",
    textPosition: "horizontal",
    children: "Volební kalkulačka",
  },
};

export const SymbolOnly: LogoStory = {
  args: {
    logoName: "Volební kalkulačka",
  },
};

export default meta;
