import { createContext, useContext } from "react";

export type EmbedContextType =
  | {
      isEmbed: false;
    }
  | {
      isEmbed: true;
      name: string;
      config?: unknown;
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
