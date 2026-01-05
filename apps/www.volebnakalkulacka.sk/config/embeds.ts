import type { ThemeName } from "./themes";

export type EmbedConfig = {
  theme?: ThemeName;
  logo?: "monochrome" | "color";
  attribution?: boolean;
  donateCard?: number | false;
};

export const embedsConfig = {
  default: {},
  aktuality: { logo: "monochrome" },
} as const satisfies Record<string, EmbedConfig>;

export type EmbedName = keyof typeof embedsConfig;

export function isEmbedName(name: string): name is EmbedName {
  return Object.hasOwn(embedsConfig, name);
}
