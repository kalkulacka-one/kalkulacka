import { type EmbedName, embedsConfig } from "../../config/embeds";
import { ThemeProvider } from "./theme-provider";

export const EmbedProvider = ({ name, children }: { name: EmbedName; children: React.ReactNode }) => {
  const themeName = embedsConfig[name].theme;

  return <ThemeProvider name={themeName}>{children}</ThemeProvider>;
};
