import { createContext, useContext } from "react";

import type { EmbedConfig, EmbedName } from "../../config/embeds";

type EmbedContextType = {
  isEmbed: boolean;
  name: EmbedName | null;
  config?: EmbedConfig;
};

const EmbedContext = createContext<EmbedContextType>({
  isEmbed: false,
  name: null,
});

export const useEmbed = () => useContext(EmbedContext);

export const EmbedContextProvider = ({ isEmbed, name, config, children }: { isEmbed: boolean; name: EmbedName | null; config?: EmbedConfig; children: React.ReactNode }) => {
  const embedValue: EmbedContextType = {
    isEmbed,
    name,
    config,
  };

  return <EmbedContext.Provider value={embedValue}>{children}</EmbedContext.Provider>;
};
