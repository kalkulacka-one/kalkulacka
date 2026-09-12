import { Button, Icon } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { createElement } from "react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Pokračovat",
    variant: "solid",
    color: "neutral",
    size: "medium",
    type: "button",
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "ghost", "surface", "plate"],
      description: "`fill`, `outline` and `link` are still accepted as aliases of `solid`, `surface` and `ghost` for the content pages that have not been restyled.",
      defaultValue: {
        summary: "solid",
      },
    },
    color: {
      control: "select",
      options: ["neutral", "primary", "secondary"],
      description: "Applies to `solid`; `ghost`, `surface` and `plate` are neutral regardless.",
      defaultValue: {
        summary: "neutral",
      },
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      defaultValue: {
        summary: "medium",
      },
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      defaultValue: {
        summary: "button",
      },
    },
    disabled: {
      control: "boolean",
      defaultValue: {
        summary: false,
      },
    },
    fullWidth: {
      control: "boolean",
      defaultValue: {
        summary: false,
      },
    },
    iconStart: {
      control: "select",
      options: Object.keys(icons),
      mapping: icons,
    },
    iconEnd: {
      control: "select",
      options: Object.keys(icons),
      mapping: icons,
    },
  },
};

type ButtonStory = StoryObj<typeof meta>;

export const Default: ButtonStory = {
  args: {
    children: "Pokračovat",
    variant: "solid",
    color: "neutral",
  },
};

export const Agree: ButtonStory = {
  args: {
    children: "Ano",
    variant: "solid",
    color: "primary",
    iconStart: icons.check,
  },
};

export const Disagree: ButtonStory = {
  args: {
    children: "Ne",
    variant: "solid",
    color: "secondary",
    iconStart: icons.cross,
  },
};

export const Ghost: ButtonStory = {
  args: {
    children: "Zrušit",
    variant: "ghost",
  },
};

export const Surface: ButtonStory = {
  args: {
    children: "Stáhnout",
    variant: "surface",
    iconStart: icons.download,
  },
};

export const Plate: ButtonStory = {
  args: {
    children: "Zpět na rekapitulaci",
    variant: "plate",
    iconStart: icons.chevronLeftThin,
  },
  decorators: [(Story) => createElement("div", { style: { padding: "2rem", background: "linear-gradient(135deg, var(--ko-color-agree-soft), var(--ko-color-disagree-soft))" } }, Story())],
};

export const Sizes: ButtonStory = {
  args: {
    children: "Pokračovat",
  },
  render: (args) =>
    createElement(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" } },
      createElement(Button, { ...args, size: "small" }),
      createElement(Button, { ...args, size: "medium" }),
      createElement(Button, { ...args, size: "large" }),
    ),
};

export const FullWidth: ButtonStory = {
  args: {
    children: "Zobrazit výsledky",
    variant: "solid",
    color: "neutral",
    size: "large",
    fullWidth: true,
  },
};

export const IconOnly: ButtonStory = {
  args: {
    children: createElement(Icon, { icon: icons.close, decorative: true }),
    variant: "ghost",
    "aria-label": "Zavřít",
  },
};

export default meta;
