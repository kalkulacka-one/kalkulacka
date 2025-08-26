import dynamic from "next/dynamic";

import type { ThemeName } from "../../config/themes";

const themes = {
  default: dynamic(() => import("./themes/default-theme").then((mod) => mod.DefaultTheme)),
} as const satisfies Record<ThemeName, React.ComponentType<{ children: React.ReactNode }>>;

export const ThemeProvider = ({ name, children }: { name: ThemeName; children: React.ReactNode }) => {
  const Theme = themes[name];
  return <Theme>{children}</Theme>;
};
