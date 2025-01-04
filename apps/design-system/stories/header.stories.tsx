import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "@repo/design-system/ui";

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
};

type HeaderStory = StoryObj<typeof meta>;

export const Default: HeaderStory = {};

export default meta;
