// Ported from kalkulacka-2026/packages/ui/src/avatar/avatar.stories.tsx
import { Avatar } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: { name: "Piráti a Starostové" },
  argTypes: {
    name: { control: "text" },
    src: { control: "text" },
    accent: { control: "color" },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      defaultValue: { summary: "medium" },
    },
    shape: {
      control: "select",
      options: ["circle", "square"],
      defaultValue: { summary: "circle" },
    },
    image: { control: "object" },
    backgroundColor: { control: "color" },
    alignment: { control: "select", options: ["center", "top"] },
    padding: { control: "boolean" },
    fit: { control: "select", options: ["cover", "contain"] },
    className: { control: false },
  },
};

type AvatarStory = StoryObj<typeof meta>;

/** No logo in the data — the initials carry it. */
export const Initials: AvatarStory = {};

export const Sizes: AvatarStory = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <Avatar {...args} size="small" />
      <Avatar {...args} size="medium" />
      <Avatar {...args} size="large" />
    </div>
  ),
};

/** A picture covers the initials opaquely when it loads. */
export const WithPicture: AvatarStory = {
  args: { name: "Portrét", src: "https://i.pravatar.cc/128?img=12" },
};

/**
 * A URL that cannot load. The 2026 source promised the initials would show
 * through; in practice the failed picture keeps its box and its surface fill
 * (see the component's comment), so this renders as a blank disc with the ring.
 */
export const BrokenImage: AvatarStory = {
  args: { src: "https://archiv.volebnikalkulacka.cz/does-not-exist.png" },
};

/** The candidate's accent: a ring around the face and a wash behind it, from the same colour the match bar uses. */
export const Accent: AvatarStory = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <Avatar {...args} accent="light-dark(#2563eb, #3b82f6)" />
      <Avatar {...args} name="ANO 2011" accent="light-dark(#7c3aed, #a78bfa)" />
      <Avatar {...args} name="ODS" accent="light-dark(#d97706, #fbbf24)" size="large" />
      <Avatar {...args} name="Portrét" src="https://i.pravatar.cc/128?img=12" accent="light-dark(#db2777, #f472b6)" size="large" />
    </div>
  ),
};

/**
 * The legacy match card's props, still honoured until it is replaced by
 * `MatchRow`: a responsive `image` set, a square shape for organisations, a
 * padded and contained logo over its own fill, and a portrait cropped to its
 * top edge.
 */
export const Legacy: AvatarStory = {
  name: "Legacy match card props",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <Avatar
        shape="circle"
        size="large"
        backgroundColor="#e2e8f0"
        alignment="top"
        image={{
          original: "https://i.pravatar.cc/300?img=12",
          md: "https://i.pravatar.cc/100?img=12",
          sm: "https://i.pravatar.cc/80?img=12",
        }}
      />
      <Avatar
        shape="square"
        size="large"
        backgroundColor="#e2e8f0"
        fit="contain"
        padding
        image={{
          original: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/ODS_logo.svg/200px-ODS_logo.svg.png",
        }}
      />
      <Avatar
        shape="square"
        size="large"
        backgroundColor="#e2e8f0"
        fit="contain"
        image={{
          original: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/ODS_logo.svg/200px-ODS_logo.svg.png",
        }}
      />
    </div>
  ),
};

export default meta;
