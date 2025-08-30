import { Logo } from "@repo/design-system/client";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
  args: {
    title: "Volební kalkulačka",
    text: true,
  },
  argTypes: {
    title: {
      control: "text",
    },
    text: {
      control: "boolean",
    },
    size: {
      control: "select",
      options: ["small", "default"],
    },
  },
};

type LogoStory = StoryObj<typeof Logo>;

export const Default: LogoStory = {
  args: {
    title: "Volební kalkulačka",
    size: "small",
  },
};

export const WithoutText: LogoStory = {
  args: {
    title: "Volební kalkulačka",
    text: false,
  },
};

export default meta;
