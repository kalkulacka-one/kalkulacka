import { Icon } from "@kalkulacka-one/design-system/client";
import { EnvelopeIcon } from "@kalkulacka-one/design-system/icons";

import { mdiAccount } from "@mdi/js";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    decorative: { control: "boolean" },
    title: { control: "text", if: { arg: "decorative", eq: false } },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
  },
};

type IconStory = StoryObj<typeof Icon>;

export const Decorative: IconStory = {
  args: {
    decorative: true,
    icon: mdiAccount,
    size: "medium",
  },
};

export const NonDecorative: IconStory = {
  args: {
    decorative: false,
    title: "Envelope icon",
    icon: EnvelopeIcon,
    size: "medium",
  },
};

export default meta;
