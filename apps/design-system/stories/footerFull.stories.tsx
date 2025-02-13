import type { Meta, StoryObj } from "@storybook/react";

import { FooterFull } from "@repo/design-system/ui";

const meta: Meta<typeof FooterFull> = {
  title: "Layout/FooterFull",
  component: FooterFull,
};

type FooterFullStory = StoryObj<typeof meta>;

export const Default: FooterFullStory = {};

export default meta;
