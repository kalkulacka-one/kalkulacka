import globalConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const colors = {
  theme: {
    extend: {
      colors: {
        red: {
          100: "#BB0000",
        },
      },
    },
  },
};

const fonts = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Radio Canada"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};

const config: Pick<Config, "content" | "prefix" | "presets"> = {
  content: ["./src/**/*.tsx"],
  prefix: "k1-",
  presets: [globalConfig, colors, fonts],
};

export default config;
