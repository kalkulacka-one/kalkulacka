import { ThemeConfig } from "tailwindcss/types/config";

const width: Pick<Partial<ThemeConfig>, "width"> = {
  // !!! Adding custom width properties
  width: {
    "clamp-custom": "clamp(32rem, 50vw, 48rem)",
  },
};

export default width;
