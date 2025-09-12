import { type EmbedName, embedsConfig } from "../../config/embeds";
import { EmbedContextProvider } from "./embed-context-provider";
import { ThemeProvider } from "./theme-provider";

export const EmbedProvider = ({ name, children }: { name: EmbedName; children: React.ReactNode }) => {
  const config = embedsConfig[name];

  return (
    <EmbedContextProvider isEmbed={true} name={name} config={config}>
      <ThemeProvider name={config.theme}>{children}</ThemeProvider>
    </EmbedContextProvider>
  );
};
