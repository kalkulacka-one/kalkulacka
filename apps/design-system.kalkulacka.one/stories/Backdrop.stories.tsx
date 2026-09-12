import { Backdrop, Card } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof Backdrop> = {
  title: "Components/Backdrop",
  component: Backdrop,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

type BackdropStory = StoryObj<typeof meta>;

/** The wash under a full viewport, mounted the way `Shell` mounts it, with a card resting on it as the content would. */
export const FullViewport: BackdropStory = {
  render: () => (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="ko-backdrop-layer" aria-hidden="true">
        <Backdrop />
      </div>
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <Card shadow="elevated">
          <div style={{ maxWidth: "24rem", padding: "2rem" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Komunální volby 2022</p>
            <p style={{ margin: "0.5rem 0 0", color: "var(--ko-color-text-muted)" }}>
              The static gradient: the page colour lifted by the surface colour in the middle, the agree and disagree colours breathing in from the corners.
            </p>
          </div>
        </Card>
      </div>
    </div>
  ),
};

/** It fills whatever positioned box it is put in — not only the viewport. */
export const InABox: BackdropStory = {
  render: () => (
    <div style={{ padding: "2rem" }}>
      <div style={{ position: "relative", height: "16rem", maxWidth: "32rem", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "var(--ko-shadow-surface)" }}>
        <Backdrop />
      </div>
    </div>
  ),
};

export default meta;
