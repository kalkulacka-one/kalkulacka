import type { Config } from "tailwindcss";
import colors from "./config/colors";
import typography from "./config/typography";

// Each package is responsible for its own content
const config: Config = {
  content: ["./src/**/*.tsx"],
  prefix: "k1-",
  theme: {
    extend: {
      ...colors,
      ...typography,
    },
  },
  plugins: [],
};

export default config;
