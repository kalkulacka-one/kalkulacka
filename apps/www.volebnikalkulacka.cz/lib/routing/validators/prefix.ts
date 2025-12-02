import { appConfig } from "@/config/app-config";
import { PREFIX_SLUGS } from "@/config/localized-slugs";

export const PREFIXES = Object.values(PREFIX_SLUGS[appConfig.i18n.defaultLocale] || {});

export function isPrefix(segment: string): boolean {
  return PREFIXES.includes(segment);
}

export function validatePrefix(prefix: string): string {
  if (!PREFIXES.includes(prefix)) {
    throw new Error(`Invalid prefix \`${prefix}\``);
  }
  return prefix;
}
