import { Icon } from "@kalkulacka-one/design-system/client";
import { Badge } from "@kalkulacka-one/design-system/server";

import { mdiHistory } from "@mdi/js";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "neutral", "yellow", "green", "transparent"],
    },
  },
};

type BadgeStory = StoryObj<typeof meta>;

export const Default: BadgeStory = {
  name: "Default badge",
  args: {
    children: "Oblíbená kalkulačka",
    color: "primary",
  },
};

export const WithIcon: BadgeStory = {
  name: "With icon",
  args: {
    color: "green",
  },
  render: (args) => (
    <Badge {...args}>
      <Icon size="small" decorative={true} icon={mdiHistory} />
      Pohled zpátky
    </Badge>
  ),
};

export default meta;
