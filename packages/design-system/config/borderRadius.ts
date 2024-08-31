import { ThemeConfig } from "tailwindcss/types/config";

const borderRadius: Pick<Partial<ThemeConfig>, "borderRadius"> = {
  // !!! We replace the default Tailwind CSS borderRadius scale with our own
  borderRadius: {
    none: "0px",
    DEFAULT: "1rem",
    md: "1.5rem",
    lg: "2rem",
    full: "9999px",
  },
};

export default borderRadius;
