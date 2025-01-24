import { ThemeConfig } from "tailwindcss/types/config";

const padding: Pick<Partial<ThemeConfig>, "padding"> = {
  // We're adding these as a default padding scale, but feel free to use any multiplies of 0.25rem as part of default Tailwind CSS padding scale e.g. h-10 p-2
  padding: {
    customDesktop: "calc(calc(1rem * 2) - calc(1rem / 16))",
    customMobile: "calc(1rem / 2 - 1rem / 16)",
    custom: "calc(1rem - calc(1rem / 16))",
  },
};

export default padding;
