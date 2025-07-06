import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "@repo/design-system/server";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
};

type HeaderStory = StoryObj<typeof meta>;

export const Default: HeaderStory = {
  render: () => {
    const isCalculator = true;
    return (
      <Header>
        <Header.Logo>My logo</Header.Logo>
        {isCalculator && <Header.Title>Krajské volby 2024 — Jihočeský kraj</Header.Title>}
        {isCalculator && <Header.Right>Zpět na hlavní stránku</Header.Right>}
      </Header>
    );
  },
};

export default meta;
