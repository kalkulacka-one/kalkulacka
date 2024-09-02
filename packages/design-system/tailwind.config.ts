import type { Config } from "tailwindcss";
import colors from "./config/colors";
import typography from "./config/typography";
import spacing from "./config/spacing";
import borderRadius from "./config/borderRadius";

<<<<<<< HEAD
// Each package is responsible for its own content
const config: Config = {
=======
import globalConfig from "@repo/tailwind-config";

import color from "./config/color";
import typography from "./config/typography";

const config: Pick<Config, "content" | "prefix" | "presets"> = {
>>>>>>> 4a2c754 (Created a textInput component based on task #24)
  content: ["./src/**/*.tsx"],
  prefix: "k1-",
  theme: {
    extend: {
      ...colors,
      ...typography,
      ...spacing,
    },
    // Replace the default Tailwind CSS with our own
    ...borderRadius,
  },
  plugins: [],
};

export default config;
