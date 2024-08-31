import { ThemeConfig } from "tailwindcss/types/config";

const colors: Pick<Partial<ThemeConfig>, "colors"> = {
  colors: {
    primary: {
      100: "var(--primary-100)",
      50: "var(--primary-50)",
    },
    secondary: {
      50: "var(--secondary-50)",
    },
    neutral: {
      100: "var(--neutral-100)",
      50: "var(--neutral-50)",
    },
  },
};

export default colors;
