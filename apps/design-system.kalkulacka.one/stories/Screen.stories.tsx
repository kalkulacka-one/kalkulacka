import { Button, IconButton } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { AppHeader, Screen, StickyBar } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const header = <AppHeader title="Volební kalkulačka" electionName="Komunální volby 2022" calculatorName="Pardubice" actions={<IconButton icon={icons.list} label="Nabídka" variant="surface" />} />;

function Rows({ count }: { count: number }) {
  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {Array.from({ length: count }, (_, index) => `Otázka ${index + 1}`).map((row) => (
        <p key={row} style={{ margin: 0, padding: "1rem 1.25rem", background: "var(--ko-color-surface)", borderRadius: "1rem", boxShadow: "var(--ko-shadow-surface)" }}>
          {row}
        </p>
      ))}
    </div>
  );
}

const footer = (
  <StickyBar>
    <Button variant="plate" size="large">
      Začít znovu
    </Button>
    <Button variant="solid" size="large">
      Zobrazit výsledky
    </Button>
  </StickyBar>
);

/*
 * No autodocs: the screen's `ScrollMode` writes onto `<html>`, and a docs page
 * mounting every story at once would have them fight over it.
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

const meta: Meta<typeof Screen> = {
  title: "Components/Screen",
  component: Screen,
  parameters: { layout: "fullscreen" },
  decorators: [fullHeightRoot],
  args: {
    title: "Rekapitulace odpovědí",
    description: "Projděte si, jak jste odpověděli, a případně odpověď změňte. Výsledek se přepočítá sám.",
    header,
    back: (
      <div style={{ display: "flex" }}>
        <Button variant="plate" size="small" iconStart={icons.chevronLeftThin}>
          Zpět
        </Button>
      </div>
    ),
    footer,
    children: <Rows count={24} />,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
  },
};

type ScreenStory = StoryObj<typeof meta>;

/** Back link, title, description, a long list and the sticky actions — scroll to see the bar pin above the viewport's edge. */
export const Default: ScreenStory = {};

/** A short screen: on a phone the actions still sit at the bottom, within thumb reach; on a desktop they follow the content. */
export const Short: ScreenStory = {
  args: {
    children: <Rows count={2} />,
  },
};

/** A headline with nothing above it needs no clearance — and no description. */
export const TitleOnly: ScreenStory = {
  args: {
    back: undefined,
    description: undefined,
    footer: undefined,
    children: <Rows count={6} />,
  },
};

export default meta;
