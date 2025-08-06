import type { Meta, StoryObj } from "@storybook/react";

import { Icon, Input } from "@repo/design-system/client";
import { EnvelopeIcon } from "@repo/design-system/icons";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
    },
  },
};

type InputStory = StoryObj<typeof meta>;

export const Default: InputStory = {
  args: {
    placeholder: "Input placeholder",
  },
};

export const WithIcon: InputStory = {
  args: {
    placeholder: "Input placeholder",
    children: <Icon decorative icon={EnvelopeIcon} />,
  },
};

export default meta;
