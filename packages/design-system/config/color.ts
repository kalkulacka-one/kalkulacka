import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const color: Pick<Config, "theme"> = {
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: `var(--k1-color-background-light, ${colors.white})`,
          light: `var(--k1-color-background-light, ${colors.white})`,
          dark: `var(--k1-color-background-dark, ${colors.gray[900]})`,
        },
        foreground: {
          DEFAULT: `var(--k1-color-foreground-light, ${colors.gray[900]})`,
          light: `var(--k1-color-foreground-light, ${colors.gray[900]})`,
          dark: `var(--k1-color-foreground-dark, ${colors.white})`,
        },
      },
    },
  },
};

export default color;
