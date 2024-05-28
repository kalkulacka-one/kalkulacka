import type { Config } from "tailwindcss";

// Each package is responsible for its own content
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        red: {
          100: "#FF0000",
        },
      },
    },
  },
  plugins: [],
};

export default config;
