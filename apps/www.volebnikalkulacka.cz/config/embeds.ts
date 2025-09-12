import type { ThemeName } from "./themes";

export type EmbedConfig = {
  theme: ThemeName;
  logo?: "monochrome";
};

export const embedsConfig = {
  default: { theme: "default" },
  "diky-ze-muzem": { theme: "diky-ze-muzem" },
  alarm: { theme: "alarm", logo: "monochrome" },
  prima: { theme: "prima", logo: "monochrome" },
  idnes: { theme: "default" },
  nova: { theme: "default" },
  e15: { theme: "default" },
  reflex: { theme: "default" },
  blesk: { theme: "default" },
  denik: { theme: "default" },
} as const satisfies Record<string, EmbedConfig>;

export type EmbedName = keyof typeof embedsConfig;

export function isEmbedName(name: string): name is EmbedName {
  return Object.hasOwn(embedsConfig, name);
}
