import { createContext, useContext } from "react";

import type { EmbedConfig, EmbedName } from "../../config/embeds";

export type EmbedContextType =
  | {
      isEmbed: false;
    }
  | {
      isEmbed: true;
      name: EmbedName;
      config?: EmbedConfig;
    };

const EmbedContext = createContext<EmbedContextType>({
  isEmbed: false,
});

export const useEmbed = () => useContext(EmbedContext);

export const EmbedContextProvider = (props: EmbedContextType & { children: React.ReactNode }) => {
  const { children, ...embedProps } = props;
  const embedValue: EmbedContextType = embedProps;

  return <EmbedContext.Provider value={embedValue}>{children}</EmbedContext.Provider>;
};
