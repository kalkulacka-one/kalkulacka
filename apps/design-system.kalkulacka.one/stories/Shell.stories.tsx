import { IconButton } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { AppHeader, Shell } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const header = <AppHeader title="Volební kalkulačka" electionName="Komunální volby 2022" calculatorName="Pardubice" actions={<IconButton icon={icons.list} label="Nabídka" variant="surface" />} />;

const rows = Array.from({ length: 40 }, (_, index) => `Řádek ${index + 1}`);

/**
 * A tall list, so the document has something to scroll and the glass bar
 * something to separate itself from. On a phone the document scrolls and this
 * is just content; on a desktop the frame is fixed again and the child has to
 * be its own scroller — which is what `Screen` does with `.ko-screen`.
 */
function TallList() {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      <div style={{ width: "100%", maxWidth: "42rem", margin: "0 auto", padding: "1rem var(--ko-spacing-fluid-gutter) 4rem", display: "grid", gap: "0.5rem" }}>
        {rows.map((row) => (
          <p key={row} style={{ margin: 0, padding: "0.75rem 1rem", background: "var(--ko-color-surface)", borderRadius: "1rem", boxShadow: "var(--ko-shadow-surface)" }}>
            {row}
          </p>
        ))}
      </div>
    </div>
  );
}

/** Fills the column under the header — the stage a pinned screen's deck sits on. */
function PinnedStage() {
  return (
    <div style={{ flex: 1, minHeight: 0, display: "grid", placeItems: "center", padding: "var(--ko-spacing-fluid-gutter)" }}>
      <div style={{ maxWidth: "24rem", padding: "2rem", background: "var(--ko-color-surface)", borderRadius: "var(--ko-radius-card)", boxShadow: "var(--ko-shadow-card)" }}>
        <p style={{ margin: 0 }}>Pinned: the document itself cannot scroll. iOS elastic bounce is stopped at the source, and this stage fills the visible viewport under the header.</p>
      </div>
    </div>
  );
}

/*
 * No autodocs: `ScrollMode` writes the scroll mode onto `<html>`, so a docs
 * page mounting both stories at once would have them fight over it and pin
 * the docs page itself.
 */
/*
 * `.ko-shell` is `height: 100%`: it expects an unbroken percentage-height chain
 * from `<body>` (which the document modes size), exactly as in 2026, where the
 * shell is the body's direct child. Storybook's root div is auto-height, so the
 * chain is restored here; an app layout that wraps the shell in divs of its own
 * has to pass the height down the same way.
 */
const fullHeightRoot = (Story: () => React.ReactNode) => (
  <>
    <style>{"#storybook-root { height: 100%; }"}</style>
    <Story />
  </>
);

const meta: Meta<typeof Shell> = {
  title: "Components/Shell",
  component: Shell,
  parameters: { layout: "fullscreen" },
  decorators: [fullHeightRoot],
  args: {
    header,
    backdrop: true,
  },
  argTypes: {
    scroll: {
      control: "select",
      options: ["pinned", "document"],
      defaultValue: {
        summary: "pinned",
      },
    },
    backdrop: { control: "boolean" },
  },
};

type ShellStory = StoryObj<typeof meta>;

/** The question flow's frame: nothing scrolls, the header is simply the first row of a column that never moves. */
export const Pinned: ShellStory = {
  args: {
    scroll: "pinned",
    children: <PinnedStage />,
  },
};

/** A reading screen: scroll, and the header holds its place while its glass surface fades in once the page has moved. */
export const Document: ShellStory = {
  args: {
    scroll: "document",
    children: <TallList />,
  },
};

/** The same frame with the wash turned off — the page colour alone. */
export const WithoutBackdrop: ShellStory = {
  args: {
    scroll: "document",
    backdrop: false,
    children: <TallList />,
  },
};

export default meta;
