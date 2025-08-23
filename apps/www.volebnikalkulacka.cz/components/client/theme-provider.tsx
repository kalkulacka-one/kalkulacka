import dynamic from "next/dynamic";

const themes = {
  default: dynamic(() => import("./themes/default-theme").then((mod) => mod.DefaultTheme)) as React.ComponentType<{ children: React.ReactNode }>,
} as const;

export const ThemeProvider = ({ name, children }: { name: keyof typeof themes; children: React.ReactNode }) => {
  const Theme = themes[name];
  return <Theme>{children}</Theme>;
};
