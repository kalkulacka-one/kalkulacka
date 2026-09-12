// Ported from kalkulacka-2026/packages/ui/src/menu/menu.stories.tsx
import { Menu } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Nabídka",
    items: [
      { id: "help", label: "Jak to funguje", detail: "Připomenutí, jak se odpovídá", icon: icons.info, onSelect: () => {} },
      { id: "color-mode", label: "Tmavý režim", detail: "Přepne aplikaci do tmavého vzhledu", icon: icons.moon, onSelect: () => {} },
      { id: "restart", label: "Začít znovu", detail: "Smaže vaše odpovědi", icon: icons.restart, onSelect: () => {} },
      { id: "leave", label: "Opustit kalkulačku", detail: "Postup zůstane uložený", icon: icons.exit, onSelect: () => {} },
    ],
  },
  argTypes: {
    label: { control: "text" },
    items: { control: false },
    icon: { control: false },
  },
};

type MenuStory = StoryObj<typeof meta>;

/**
 * Open it and try the keyboard: focus lands on the first item, ↑/↓ cycle,
 * Escape closes and hands focus back to the trigger, Tab leaves.
 */
export const Default: MenuStory = {
  render: (args) => (
    // Right-aligned, since the popover hangs from the trigger's right edge —
    // the same corner it occupies in the app header; `flex-start` keeps the
    // trigger at its own height rather than stretched to the row's.
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", minHeight: "22rem" }}>
      <Menu {...args} />
    </div>
  ),
};

/** Outside a calculator only one action applies, so only one is offered. */
export const SingleItem: MenuStory = {
  args: {
    items: [{ id: "help", label: "Jak to funguje", detail: "Připomenutí, jak se odpovídá", icon: icons.info, onSelect: () => {} }],
  },
  render: (args) => (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", minHeight: "14rem" }}>
      <Menu {...args} />
    </div>
  ),
};

/** Labels alone, for a menu whose actions need no explaining. */
export const WithoutDetails: MenuStory = {
  args: {
    items: [
      { id: "help", label: "Jak to funguje", icon: icons.info, onSelect: () => {} },
      { id: "restart", label: "Začít znovu", icon: icons.restart, onSelect: () => {} },
    ],
  },
  render: (args) => (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", minHeight: "14rem" }}>
      <Menu {...args} />
    </div>
  ),
};

export default meta;
