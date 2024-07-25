import type { Config } from "tailwindcss";

import globalConfig from "@repo/tailwind-config";

import typography from "./config/typography.ts"

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

const config: Pick<Config, "content" | "prefix" | "presets"> = {
  content: ["./src/**/*.tsx"],
  prefix: "k1-",
  presets: [globalConfig, colors, typography],
};

export default config;
