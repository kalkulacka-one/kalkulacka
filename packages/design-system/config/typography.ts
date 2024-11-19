// import defaultTheme from "tailwindcss/defaultTheme";
import { ThemeConfig } from "tailwindcss/types/config";

const typography: Pick<
  Partial<ThemeConfig>,
  "fontFamily" | "fontSize" | "fontWeight" | "lineHeight" | "letterSpacing"
> = {
  fontFamily: {
    primary: [
      '"Inter"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ],
    secondary: [
      '"Radio Canada"',
      "Georgia",
      '"Times New Roman"',
      "Times",
      "serif",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ],
  },
  fontSize: {
    xs: "0.625rem", // 10px
    sm: "0.8125rem", // 13px
    base: "1rem", // 16px
    lg: "1.1875rem", // 19px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.5625rem", // 25px
    "4xl": "1.875rem", // 30px
    "5xl": "1.9375rem", // 31px
    "6xl": "2.375rem", // 38px
    "7xl": "2.4375rem", // 39px
    "8xl": "2.9375rem", // 47px
    "9xl": "3.0625rem", // 49px
    "10xl": "3.6875rem", // 59px
    "11xl": "3.8125rem", // 61px
    "12xl": "4.5625rem", // 73px
    "13xl": "5.75rem", // 92px
  },
  lineHeight: {
    xs: "1rem", // 16px
    sm: "1.25rem", // 20px
    md: "1.5rem", // 24px
    lg: "2.5rem", // 40px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "3.5rem", // 56px
    "4xl": "4rem", // 64px
    "5xl": "5rem", // 80px
    "6xl": "6rem", // 96px
  },
  letterSpacing: {
    tighter: "-0.0800em", // -8%
    tight: "-0.0700em", // -7%
    snug: "-0.0600em", // -6%
    normal: "0.0000em", // 0% (default)
    wide: "0.0400em", // 4%
    wider: "0.0500em", // 5%
    widest: "0.0700em", // 7%
    "slight-tight": "-0.0500em", // -5% (slightly tighter)
    loose: "-0.0400em", // -4% (slightly loose but negative)
  },
};

// Simplified the Export of Typography Config
export const fontFamily = typography.fontFamily;
export const fontSize = typography.fontSize;
export const lineHeight = typography.lineHeight;
export const letterSpacing = typography.letterSpacing;
