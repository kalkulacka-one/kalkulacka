import { type EmbedLogo, type EmbedName, embedsConfig } from "../../config/embeds";
import { EmbedContextProvider } from "./embed-context-provider";
import { ThemeProvider } from "./theme-provider";

export const EmbedProvider = ({ name, children }: { name: EmbedName; children: React.ReactNode }) => {
  const themeName = embedsConfig[name].theme;
  const logo = "logo" in embedsConfig[name] ? (embedsConfig[name].logo as EmbedLogo) : undefined;

  return (
    <EmbedContextProvider isEmbed={true} name={name} logo={logo}>
      <ThemeProvider name={themeName}>{children}</ThemeProvider>
    </EmbedContextProvider>
  );
};
