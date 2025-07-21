import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "@repo/design-system/server";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <Header.Left>Left</Header.Left>
        <Header.Right>Right</Header.Right>
      </>
    ),
  },
};

type HeaderStory = StoryObj<typeof meta>;

export const Default: HeaderStory = {};

export default meta;
