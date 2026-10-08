import type { ThemeName } from "./themes";

export type EmbedConfig = {
  theme?: ThemeName;
  logo?: "monochrome" | "color";
  attribution?: boolean;
  donateCard?: number | false;
};

export const embedsConfig = {
  default: {},
  "diky-ze-muzem": { theme: "diky-ze-muzem", logo: "monochrome", donateCard: false },
  alarm: { theme: "alarm", logo: "monochrome" },
  prima: { theme: "prima", logo: "monochrome" },
  idnes: {},
  nova: {},
  e15: {},
  reflex: {},
  blesk: {},
  denik: {},
  publico: {},
  aktuality: {},
  datatimes: {},
  hn: {},
  seznamzpravy: {},
  novinky: {},
  aktualne: {},
  ct24: {},
  irozhlas: {},
  denikn: {},
  lidovky: {},
  echo24: {},
  forum24: {},
  info: {},
  respekt: {},
  euro: {},
  hlidacipes: {},
  investigace: {},
  rozhlas: {},
  metro: {},
  krajskelisty: {},
  "mesto-brno": {},
  "mesto-ostrava": {},
  "mesto-plzen": {},
  refresher: {},
  seznam: {},
  heroine: {},
  webpress: {},
  znojemsko: {},
  brandysko: {},
  "denik-referendum": {},
  tyden: {},
  instinkt: {},
  ekonom: {},
  forbes: {},
  reporter: {},
  neovlivni: {},
  abc: {},
  "bold-news": {},
  "studentske-listy": {},
  tiscali: {},
  czechcrunch: {},
} as const satisfies Record<string, EmbedConfig>;

export type EmbedName = keyof typeof embedsConfig;

export function isEmbedName(name: string): name is EmbedName {
  return Object.hasOwn(embedsConfig, name);
}
