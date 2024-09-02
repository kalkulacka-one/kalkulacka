import type { Config } from "tailwindcss";

import globalConfig from "@repo/tailwind-config";

import color from "./config/color";
import typography from "./config/typography";

const config: Pick<Config, "content" | "prefix" | "presets"> = {
  content: ["./src/**/*.tsx"],
  prefix: "k1-",
  presets: [globalConfig, color, typography],
};

export default config;
