import { Menu } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { AppHeader } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof AppHeader> = {
  title: "Components/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Volební kalkulačka",
  },
  argTypes: {
    title: { control: "text" },
    electionName: { control: "text" },
    calculatorName: { control: "text" },
    href: { control: "text" },
    logoMonochrome: { control: "boolean" },
  },
};

type AppHeaderStory = StoryObj<typeof meta>;

/** Outside a calculator — the picker and the homepage carry the brand alone. */
export const Default: AppHeaderStory = {};

/** Inside a calculator: the election type in the muted ink, then the region, then the year. */
export const WithElection: AppHeaderStory = {
  args: {
    electionName: "Komunální volby 2022",
    calculatorName: "Pardubice",
  },
};

/** No region chosen yet: the election names itself, nothing between type and year. */
export const ElectionOnly: AppHeaderStory = {
  args: {
    electionName: "Komunální volby 2022",
  },
};

/** A long region name truncates rather than wrapping the bar to a second line. */
export const LongName: AppHeaderStory = {
  args: {
    electionName: "Komunální volby 2022",
    calculatorName: "Frýdek-Místek — obvod 3, Staré Město a okolí",
  },
};

/** An embed: the brand is the attribution, a real link into a new tab. The title underlines only when pointed at. */
export const AsAttributionLink: AppHeaderStory = {
  args: {
    electionName: "Komunální volby 2022",
    calculatorName: "Pardubice",
    href: "https://www.volebnikalkulacka.cz",
  },
};

/** The shell menu in the actions slot, pushed to the right edge — its popover hangs from that same corner. */
export const WithActions: AppHeaderStory = {
  args: {
    electionName: "Komunální volby 2022",
    calculatorName: "Pardubice",
    actions: (
      <Menu
        label="Nabídka"
        items={[
          { id: "help", label: "Jak to funguje", detail: "Připomenutí, jak se odpovídá", icon: icons.info, onSelect: () => {} },
          { id: "restart", label: "Začít znovu", detail: "Smaže vaše odpovědi", icon: icons.restart, onSelect: () => {} },
        ]}
      />
    ),
  },
  render: (args) => (
    <div style={{ minHeight: "14rem" }}>
      <AppHeader {...args} />
    </div>
  ),
};

/** The mark in the text ink — for a partner theme whose brand colours would clash with the logo's. */
export const MonochromeLogo: AppHeaderStory = {
  args: {
    electionName: "Komunální volby 2022",
    calculatorName: "Pardubice",
    logoMonochrome: true,
  },
};

export default meta;
