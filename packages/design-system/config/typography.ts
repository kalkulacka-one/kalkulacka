import defaultTheme from "tailwindcss/defaultTheme";
import { ThemeConfig } from "tailwindcss/types/config";

const typography: Pick<
  Partial<ThemeConfig>,
  "fontFamily" | "fontSize" | "fontWeight" | "lineHeight" | "letterSpacing"
> = {
  fontFamily: {
    sans: ['"Radio Canada"', ...defaultTheme.fontFamily.sans],
  },
  fontSize: {
    xs: "0.625rem",
    sm: "0.812rem",
  },
};

export default typography;
