import { ALLOWED_PREFIXES } from "../allowed-prefixes";

export function validateAllowedPrefix(prefix: string): string {
  if (!ALLOWED_PREFIXES.includes(prefix)) {
    throw new Error(`Invalid prefix \`${prefix}\``);
  }
  return prefix;
}
