import { createContext, useContext } from "react";

import type { EmbedName } from "../../config/embeds";

type EmbedContextType = {
  isEmbed: boolean;
  name: EmbedName | null;
};

const EmbedContext = createContext<EmbedContextType>({
  isEmbed: false,
  name: null,
});

export const useEmbed = () => useContext(EmbedContext);

export const EmbedContextProvider = ({ isEmbed, name, children }: { isEmbed: boolean; name: EmbedName | null; children: React.ReactNode }) => {
  const embedValue: EmbedContextType = {
    isEmbed,
    name,
  };

  return <EmbedContext.Provider value={embedValue}>{children}</EmbedContext.Provider>;
};
