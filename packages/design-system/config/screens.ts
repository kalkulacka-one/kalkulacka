import { ThemeConfig } from "tailwindcss/types/config";

const screens: Pick<Partial<ThemeConfig>, "screens"> = {
  // !!! We replace the default Tailwind CSS breakpoints scale with our own
  screens: {
    xs: "576px",
    sm: "768px",
    md: "992px",
    lg: "1200px",
    xl: "1400px",
  },
};

export default screens;
