import type { Config } from "tailwindcss";
import colors from "./config/colors";
import {
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
} from "./config/typography";
import spacing from "./config/spacing";
import borderRadius from "./config/borderRadius";
import boxShadow from "./config/boxShadow";
import screens from "./config/screens";
import padding from "./config/padding";

// Each package is responsible for its own content
const config: Config = {
  content: ["./src/**/*.tsx"],
  prefix: "k1-",
  theme: {
    ...screens,
    extend: {
      ...colors,
      ...spacing,
      ...boxShadow,
      fontFamily: { ...fontFamily },
      fontSize: { ...fontSize },
      lineHeight: { ...lineHeight },
      letterSpacing: { ...letterSpacing },
      ...padding,
    },
    // Replace the default Tailwind CSS with our own
    ...borderRadius,
  },
  plugins: [],
};

export default config;
