import { ThemeConfig } from "tailwindcss/types/config";

const boxShadow: Pick<Partial<ThemeConfig>, "boxShadow"> = {
  // !!! Adding custom boxShadow
  boxShadow: {
    // TODO: rewrite colors in RGB later
    neutral: "6px 8px 0px 0px #DAD8D733",
  },
};

export default boxShadow;
