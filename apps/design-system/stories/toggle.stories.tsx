import type { Meta, StoryObj } from "@storybook/react";

import { Toggle } from "@repo/design-system/toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
};

type ToggleStory = StoryObj<typeof meta>;

export const Default: ToggleStory = {};

export default meta;
