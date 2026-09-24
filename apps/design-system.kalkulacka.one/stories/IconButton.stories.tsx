import { IconButton } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    icon: icons.close,
    label: "Close",
    variant: "ghost",
    size: "medium",
    disabled: false,
  },
  argTypes: {
    icon: {
      control: "select",
      options: Object.keys(icons),
      mapping: icons,
    },
    label: {
      control: "text",
    },
    variant: {
      control: "select",
      options: ["ghost", "surface"],
      defaultValue: {
        summary: "ghost",
      },
    },
    size: {
      control: "select",
      options: ["medium", "large"],
      defaultValue: {
        summary: "medium",
      },
    },
    disabled: {
      control: "boolean",
      defaultValue: {
        summary: false,
      },
    },
  },
};

type IconButtonStory = StoryObj<typeof meta>;

export const Default: IconButtonStory = {
  args: {
    icon: icons.close,
    label: "Close",
  },
};

export const Surface: IconButtonStory = {
  args: {
    icon: icons.more,
    label: "Menu",
    variant: "surface",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem", background: "linear-gradient(135deg, var(--ko-color-agree-soft), var(--ko-color-disagree-soft))" }}>
        <Story />
      </div>
    ),
  ],
};

export const Large: IconButtonStory = {
  args: {
    icon: icons.share,
    label: "Share",
    size: "large",
  },
};

export const Disabled: IconButtonStory = {
  args: {
    icon: icons.restart,
    label: "Start over",
    disabled: true,
  },
};

export default meta;
