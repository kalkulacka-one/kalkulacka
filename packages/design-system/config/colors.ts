import { ThemeConfig } from "tailwindcss/types/config";

const primaryColors = {
  90: "var(--primary-90)",
  70: "var(--primary-70)",
  50: "var(--primary-50)",
  30: "var(--primary-30)",
  10: "var(--primary-10)",
};

const secondaryColors = {
  90: "var(--secondary-90)",
  70: "var(--secondary-70)",
  50: "var(--secondary-50)",
  30: "var(--secondary-30)",
  10: "var(--secondary-10)",
};

const neutralColors = {
  100: "var(--neutral-100)",
  90: "var(--neutral-90)",
  70: "var(--neutral-70)",
  50: "var(--neutral-50)",
  30: "var(--neutral-30)",
  10: "var(--neutral-10)",
  0: "var(--neutral-0)",
};

const backgroundColorNeutral = {
  neutral: neutralColors[90],
  "neutral-strong-hover": neutralColors[30],
  "neutral-strong-active": neutralColors[10],
  "neutral-disabled": neutralColors[70],
  "neutral-backdrop": `rgb(from ${neutralColors[70]} r g b / 0.1)`,
  "neutral-backdrop-hover": `rgb(from ${neutralColors[70]} r g b / 0.2)`,
  "neutral-backdrop-active": `rgb(from ${neutralColors[70]} r g b / 0.6)`,
};

const textColorNeutral = {
  neutral: neutralColors[30],
  "neutral-hover": neutralColors[50],
  "neutral-active": neutralColors[0],
  "neutral-muted": neutralColors[50],
  "neutral-strong": neutralColors[10],
  "neutral-inverse": neutralColors[100],
  "neutral-disabled": neutralColors[70],
};

const borderColorNeutral = {
  neutral: neutralColors[70],
  "neutral-hover": neutralColors[50],
  "neutral-active": neutralColors[10],
  "neutral-muted": neutralColors[90],
  "neutral-strong": neutralColors[30],
  "neutral-disabled": neutralColors[70],
};

const backgroundColorPrimary = {
  primary: primaryColors[90],
  "primary-strong": primaryColors[50],
  "primary-strong-hover": primaryColors[30],
  "primary-strong-active": primaryColors[10],
};

const textColorPrimary = {
  primary: primaryColors[50],
  "primary-hover": primaryColors[30],
  "primary-strong": primaryColors[10],
};

const borderColorPrimary = {
  primary: primaryColors[70],
  "primary-strong-hover": primaryColors[30],
  "primary-strong": primaryColors[50],
};

const backgroundColorSecondary = {
  secondary: secondaryColors[90],
  "secondary-strong": secondaryColors[50],
  "secondary-strong-hover": secondaryColors[30],
  "secondary-strong-active": secondaryColors[10],
};

const textColorSecondary = {
  secondary: secondaryColors[50],
  "secondary-hover": secondaryColors[30],
  "secondary-strong": secondaryColors[30],
};

const borderColorSecondary = {
  secondary: secondaryColors[70],
  "secondary-strong-hover": secondaryColors[30],
  "secondary-strong": secondaryColors[50],
};

const colors: Pick<
  Partial<ThemeConfig>,
  "colors" | "backgroundColor" | "textColor" | "borderColor"
> = {
  colors: {
    // basic color palettes
    primary: primaryColors,
    secondary: secondaryColors,
    neutral: neutralColors,
    "neutral-container": neutralColors[100],
    "neutral-page": neutralColors[100],
    "neutral-overlay": `rgb(from ${neutralColors[100]} r g b / 0.8)`,
  },
  backgroundColor: {
    ...backgroundColorNeutral,
    ...backgroundColorPrimary,
    ...backgroundColorSecondary,
  },
  textColor: {
    ...textColorNeutral,
    ...textColorPrimary,
    ...textColorSecondary,
  },
  borderColor: {
    ...borderColorNeutral,
    ...borderColorPrimary,
    ...borderColorSecondary,
  },
};

export default colors;
