import type { Meta, StoryObj } from "@storybook/react";

import { Typography } from "@repo/design-system/typography";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
};

type TypographyStory = StoryObj<typeof meta>;

export const Default: TypographyStory = {};

export default meta;
