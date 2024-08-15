import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const typography: Pick<Config, "theme"> = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Radio Canada"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};

export default typography;
