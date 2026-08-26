import { EmbedContextProvider } from "@kalkulacka-one/app/client";

import { type EmbedConfig, type EmbedName, embedsConfig } from "@/config/embeds";

import { ThemeProvider } from "./theme-provider";

export const EmbedProvider = ({ name, children }: { name: EmbedName; children: React.ReactNode }) => {
  const config = embedsConfig[name] as EmbedConfig;

  return (
    <EmbedContextProvider isEmbed={true} name={name} config={config}>
      <ThemeProvider name={config?.theme ?? "default"}>{children}</ThemeProvider>
    </EmbedContextProvider>
  );
};
