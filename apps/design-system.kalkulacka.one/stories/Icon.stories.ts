import { Icon } from "@kalkulacka-one/design-system/client";
import { EnvelopeIcon, type IconName, icons } from "@kalkulacka-one/design-system/icons";

import { mdiAccount } from "@mdi/js";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { createElement } from "react";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    decorative: { control: "boolean" },
    title: { control: "text", if: { arg: "decorative", eq: false } },
    filled: { control: "boolean" },
    size: {
      control: "select",
      options: ["xsmall", "small", "regular", "medium", "large"],
    },
  },
};

type IconStory = StoryObj<typeof Icon>;

export const Decorative: IconStory = {
  args: {
    decorative: true,
    icon: mdiAccount,
    size: "medium",
  },
};

export const NonDecorative: IconStory = {
  args: {
    decorative: false,
    title: "Envelope icon",
    icon: EnvelopeIcon,
    size: "medium",
  },
};

/** The star fills when a question is marked "pro mě důležité". */
export const Filled: IconStory = {
  args: {
    decorative: true,
    icon: icons.star,
    filled: true,
    size: "large",
  },
};

/** Every icon in the set, by name. */
export const Gallery: IconStory = {
  args: {
    decorative: true,
    icon: icons.check,
    size: "regular",
  },
  render: (args) =>
    createElement(
      "div",
      { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(8rem, 1fr))", gap: "1.5rem 1rem" } },
      (Object.keys(icons) as IconName[]).map((name) =>
        createElement(
          "figure",
          { key: name, style: { display: "grid", gap: "0.5rem", justifyItems: "center", margin: 0 } },
          createElement(Icon, { icon: icons[name], decorative: true, size: args.size }),
          createElement("figcaption", { style: { fontSize: "0.75rem" } }, name),
        ),
      ),
    ),
};

export default meta;
