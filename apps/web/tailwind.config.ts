import globalConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const fonts = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Radio Canada"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};

const config: Pick<Config, "content" | "presets"> = {
  content: ["./app/**/*.tsx"],
  presets: [globalConfig, fonts],
};

export default config;
