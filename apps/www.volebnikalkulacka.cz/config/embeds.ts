import type { ThemeName } from "./themes";

export type EmbedConfig = {
  logo?: "monochrome";
  theme?: ThemeName;
};

export const embedsConfig = {
  default: {},
  "diky-ze-muzem": { theme: "diky-ze-muzem" },
  alarm: { theme: "alarm", logo: "monochrome" },
  prima: { theme: "prima", logo: "monochrome" },
  idnes: {},
  nova: {},
  e15: {},
  reflex: {},
  blesk: {},
  denik: {},
} as const satisfies Record<string, EmbedConfig>;

export type EmbedName = keyof typeof embedsConfig;

export function isEmbedName(name: string): name is EmbedName {
  return Object.hasOwn(embedsConfig, name);
}
