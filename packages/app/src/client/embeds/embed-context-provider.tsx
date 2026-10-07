import { createContext, useContext, useEffect } from "react";

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
  // Horizontal space (px) inside the iframe, outside the scrolling content, for partners who embed edge to edge:
  // a swipe that starts there has nothing to scroll in the iframe, so it scrolls the partner's page instead.
  inset?: number;
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
  const inset = embedProps.isEmbed ? embedProps.config?.inset : undefined;

  useEffect(() => {
    // PROTOTYPE: `?inset=16` on the first load overrides the config, so the preview page can try values. It lives on
    // <html>, which client-side navigation keeps, so it holds for the whole session in the iframe.
    const override = new URLSearchParams(window.location.search).get("inset");
    const value = override !== null ? Number(override) : inset;
    if (value === undefined || Number.isNaN(value)) return;
    document.documentElement.style.setProperty("--koa-embed-inset", `${value}px`);
  }, [inset]);

  return <EmbedContext.Provider value={embedValue}>{children}</EmbedContext.Provider>;
};
