import globalConfig from "@repo/design-system/tailwind";
import type { Config } from "tailwindcss";

const config: Pick<Config, "content" | "presets" | "prefix" | "theme"> = {
  presets: [globalConfig],
  content: ["./app/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        primary: [
          "var(--font-primary)",
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
          "var(--font-secondary)",
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
    },
  },
  prefix: "", // design-system has k1- prefix. We might or might not use it in other projects. But it's better to not conflict with it.
};

export default config;
