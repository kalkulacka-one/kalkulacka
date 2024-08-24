import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

// Each package is responsible for its own content
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
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
      fontFamily: {
        sans: ['"Radio Canada"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
