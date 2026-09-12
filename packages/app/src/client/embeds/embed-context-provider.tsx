import { createContext, useContext } from "react";

// Apps declare their own embed names by augmenting this interface, the way
// next-intl's AppConfig is augmented for locales and messages:
//
//   declare module "@kalkulacka-one/app/client" {
//     interface AppEmbeds {
//       Name: keyof typeof embedsConfig;
//     }
//   }
//
// Without an augmentation embed names stay plain strings, so the package (and
// any app that has not declared them) still compiles.
// biome-ignore lint/suspicious/noEmptyInterface: empty by design — apps fill it in by declaration merging, which a type alias cannot do
export interface AppEmbeds {}

export type EmbedName = AppEmbeds extends { Name: infer Name extends string } ? Name : string;

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
