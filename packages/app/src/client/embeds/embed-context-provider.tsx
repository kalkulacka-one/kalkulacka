import { createContext, useContext } from "react";

export type EmbedConfig = {
  theme?: string;
  logo?: "monochrome" | "color";
  attribution?: boolean;
  donateCard?: number | false;
};

export type EmbedContextType =
  | {
      isEmbed: false;
    }
  | {
      isEmbed: true;
      name: string;
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
