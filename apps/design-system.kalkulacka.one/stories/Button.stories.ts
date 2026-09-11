import { Button, Icon } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";

import { mdiClose, mdiCog, mdiMagnify } from "@mdi/js";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { createElement } from "react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "fill",
    color: "primary",
    size: "medium",
    type: "button",
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      defaultValue: {
        summary: "medium",
      },
    },
    variant: {
      control: "select",
      options: ["fill", "outline", "link", "answer", "solid", "ghost", "surface", "plate"],
      defaultValue: {
        summary: "fill",
      },
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "neutral"],
      defaultValue: {
        summary: "primary",
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
    children: "Button",
    variant: "fill",
    color: "primary",
    type: "button",
    disabled: false,
  },
};

export const Outline: ButtonStory = {
  args: {
    children: "Outline",
    variant: "outline",
    color: "primary",
  },
};

export const Link: ButtonStory = {
  args: {
    children: "Link",
    variant: "link",
    color: "primary",
  },
};

export const Answer: ButtonStory = {
  args: {
    children: "Answer",
    variant: "answer",
    color: "primary",
  },
};

export const Solid: ButtonStory = {
  args: {
    children: "Pokračovat",
    variant: "solid",
    color: "neutral",
  },
};

export const Ghost: ButtonStory = {
  args: {
    children: "Přeskočit",
    variant: "ghost",
    color: "neutral",
  },
};

export const Surface: ButtonStory = {
  args: {
    children: "Zobrazit další",
    variant: "surface",
    color: "neutral",
  },
};

export const Plate: ButtonStory = {
  args: {
    children: "Zpět",
    variant: "plate",
    color: "neutral",
    iconStart: icons.arrowLeft,
  },
  decorators: [(Story) => createElement("div", { style: { padding: "2rem", background: "linear-gradient(135deg, var(--ko-color-agree-soft), var(--ko-color-disagree-soft))" } }, Story())],
};

export const WithIcons: ButtonStory = {
  args: {
    children: "Sdílet výsledek",
    variant: "solid",
    color: "primary",
    iconStart: icons.share,
    iconEnd: icons.arrowRight,
  },
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
    children: createElement(Icon, { icon: mdiMagnify, decorative: true }),
    variant: "fill",
    color: "primary",
    type: "button",
    disabled: false,
  },
};

export const IconOnlySecondary: ButtonStory = {
  args: {
    children: createElement(Icon, { icon: mdiClose, decorative: true }),
    variant: "outline",
    color: "secondary",
    type: "button",
    disabled: false,
  },
};

export const IconOnlyNeutral: ButtonStory = {
  args: {
    children: createElement(Icon, { icon: mdiCog, decorative: true }),
    variant: "fill",
    color: "neutral",
    type: "button",
    disabled: false,
  },
};

export default meta;
