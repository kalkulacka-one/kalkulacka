import type { Config } from "tailwindcss";

const color: Pick<Config, "theme"> = {
  theme: {
    extend: {
      colors: {
        red: {
          100: "#BB0000",
        },
      },
    },
  },
};

export default color;
