import type { ThemeName } from "./themes";

export type EmbedConfig = {
  theme: ThemeName;
};

export const embedsConfig = {
  default: { theme: "default" },
  "diky-ze-muzem": { theme: "diky-ze-muzem" },
} as const satisfies Record<string, EmbedConfig>;

export type EmbedName = keyof typeof embedsConfig;

export function isEmbedName(name: string): name is EmbedName {
  return Object.hasOwn(embedsConfig, name);
}
