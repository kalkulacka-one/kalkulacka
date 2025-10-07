import { mdiAbTesting } from "@mdi/js";
import { Icon } from "@repo/design-system/client";
import { IconBadge } from "@repo/design-system/server";
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
