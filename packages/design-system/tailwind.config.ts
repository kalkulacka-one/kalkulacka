import type { Config } from "tailwindcss";
import colors from "./config/colors";
import typography from "./config/typography";
import spacing from "./config/spacing";
import borderRadius from "./config/borderRadius";
import boxShadow from "./config/boxShadow";

// Each package is responsible for its own content
const config: Config = {
  content: ["./src/**/*.tsx"],
  prefix: "k1-",
  theme: {
    extend: {
      ...colors,
      ...typography,
      ...spacing,
      ...boxShadow,
    },
    // Replace the default Tailwind CSS with our own
    ...borderRadius,
  },
  plugins: [],
};

export default config;
