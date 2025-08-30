import type { Meta, StoryObj } from "@storybook/react";

import { Introduction } from ".";

const meta = {
  title: "Introduction",
  component: Introduction,
  tags: ["autodocs"],
  argTypes: {
    calculator: { control: { type: "object" } },
  },
} satisfies Meta<typeof Introduction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    calculator: {
      id: "00000000-0000-0000-0000-000000000000",
      createdAt: new Date(0).toISOString(),
      key: "kalkulacka",
      shortTitle: "Sněmovní 2025",
      title: "Volební kalkulačka pro sněmovní volby 2025",
      intro: "Čeká vás 35 otázek, na které jsme se zeptali všech 26 kandidujících subjektů.",
    },
  },
};
