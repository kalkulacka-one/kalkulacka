import type { Config } from "tailwindcss";

import globalConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "prefix" | "presets"> = {
  content: ["./src/**/*.tsx"],
  presets: [globalConfig],
};

export default config;
