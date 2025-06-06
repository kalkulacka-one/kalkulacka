import type { Meta, StoryObj } from "@storybook/nextjs";
import type { ArgTypes } from "@storybook/nextjs";

import { Icon, iconSizes } from "@repo/design-system/server";
import { iconNames } from "@repo/design-system/types";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: iconNames,
    },
    size: {
      control: "select",
      options: iconSizes,
    },
    color: {
      control: "color",
    },
  } as ArgTypes,
};

type IconStory = StoryObj<typeof meta>;

export const Default: IconStory = {
  args: {
    name: "SearchIcon",
    size: "medium",
    title: "Search icon",
  },
};

export default meta;
