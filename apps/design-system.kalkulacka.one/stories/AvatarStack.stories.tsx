// Ported from kalkulacka-2026/packages/ui/src/avatar-stack/avatar-stack.stories.tsx
import { AvatarStack } from "@kalkulacka-one/design-system/client";
import { partyColor } from "@kalkulacka-one/design-system/utilities";

import type { Meta, StoryObj } from "@storybook/nextjs";

const PARTIES = ["ANO 2011", "Piráti a Starostové", "ODS", "Společně pro Pardubice", "SPD", "KDU-ČSL", "TOP 09", "Zelení", "ČSSD", "Svobodní", "Volba pro město", "Nezávislí"].map((name, index) => ({
  id: `p${index}`,
  name,
}));

const meta: Meta<typeof AvatarStack> = {
  title: "Components/AvatarStack",
  component: AvatarStack,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    items: PARTIES.slice(0, 5),
    label: "Strany, které s vámi souhlasí",
  },
  argTypes: {
    items: { control: "object" },
    max: { control: "number" },
    size: {
      control: "select",
      options: ["small", "medium"],
      defaultValue: { summary: "small" },
    },
    label: { control: "text" },
    popover: { control: "object" },
  },
};

type AvatarStackStory = StoryObj<typeof meta>;

export const Few: AvatarStackStory = {};

/** One over the limit keeps its face — a "+1" disc costs the same room and says less. */
export const AtTheLimit: AvatarStackStory = {
  args: { items: PARTIES.slice(0, 9) },
};

export const Overflowing: AvatarStackStory = {
  args: { items: PARTIES },
};

export const Medium: AvatarStackStory = {
  args: { items: PARTIES.slice(0, 6), size: "medium" },
};

/** Each face in its own accent, the way the dashboard draws the parties that agreed with you. */
export const Accented: AvatarStackStory = {
  args: { items: PARTIES.slice(0, 7).map((item) => ({ ...item, accent: partyColor(item.name) })) },
};

/** Nobody took your side — the stack renders nothing rather than an empty rail. */
export const Empty: AvatarStackStory = {
  args: { items: [] },
};

/** Hover (mouse) or tap (touch/keyboard) opens a popover naming every face. */
export const WithPopover: AvatarStackStory = {
  args: { items: PARTIES, popover: { closeLabel: "Zavřít" } },
};

/** In a card, over content below it — the open panel rises above its neighbours. */
export const InCards: AvatarStackStory = {
  args: { items: PARTIES.slice(0, 7), popover: { closeLabel: "Zavřít" } },
  render: (args) => (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: "24rem" }}>
      {["Omezení vánoční výzdoby", "Regulace zábavní pyrotechniky"].map((title) => (
        <div key={title} style={{ padding: "1rem", borderRadius: "var(--ko-radius-control)", background: "var(--ko-color-surface)", boxShadow: "var(--ko-shadow-surface)" }}>
          <p style={{ margin: "0 0 0.5rem", fontFamily: "var(--ko-font-sans)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--ko-color-text-strong)" }}>{title}</p>
          <AvatarStack {...args} />
        </div>
      ))}
    </div>
  ),
};

export default meta;
