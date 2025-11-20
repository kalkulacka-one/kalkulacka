import { Icon } from "@kalkulacka-one/design-system/client";
import { IconBadge } from "@kalkulacka-one/design-system/server";
import { mdiAbTesting } from "@mdi/js";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof IconBadge> = {
  title: "Components/IconBadge",
  component: IconBadge,
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "neutral"],
    },
  },
};

type IconBadgeStory = StoryObj<typeof meta>;

export const Default: IconBadgeStory = {
  name: "Default icon badge",
  render: (args) => (
    <IconBadge {...args}>
      <Icon icon={mdiAbTesting} decorative={true} size="medium" />
    </IconBadge>
  ),
};

export default meta;
