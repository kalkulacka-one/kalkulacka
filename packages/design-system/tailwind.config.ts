import globalConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

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
  prefix: "ds-",
  presets: [globalConfig, colors],
};

export default config;
