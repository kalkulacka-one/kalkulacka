import { createContext, useContext } from "react";

import type { EmbedLogo, EmbedName } from "../../config/embeds";

type EmbedContextType = {
  isEmbed: boolean;
  name: EmbedName | null;
  logo?: EmbedLogo | null;
};

const EmbedContext = createContext<EmbedContextType>({
  isEmbed: false,
  name: null,
  logo: undefined,
});

export const useEmbed = () => useContext(EmbedContext);

export const EmbedContextProvider = ({ isEmbed, name, logo, children }: { isEmbed: boolean; name: EmbedName | null; logo?: EmbedLogo | undefined; children: React.ReactNode }) => {
  const embedValue: EmbedContextType = {
    isEmbed,
    name,
    logo,
  };

  return <EmbedContext.Provider value={embedValue}>{children}</EmbedContext.Provider>;
};
